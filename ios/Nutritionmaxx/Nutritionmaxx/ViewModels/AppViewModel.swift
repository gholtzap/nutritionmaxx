import Foundation
import Observation

@Observable
final class AppViewModel {
    var foods: [FoodItem] = []
    var loading = false
    var error: String?

    var searchQuery = ""
    var selectedType: ItemType?
    var selectedCategories: Set<ItemCategory> = []
    var sort = SortConfig()

    var selectedFood: FoodItem?
    var comparisonFoods: [FoodItem] = []

    var showDailyValue = true
    var showPerServing = true

    var planEntries: [PlanEntry] = []
    var lockedPlanEntries: Set<String> = []
    var budgetTolerance = 10
    var lockedNutrients: Set<NutrientKey> = []

    var scoreNutrients: Set<NutrientKey> = defaultScoreNutrients

    var dietaryPreferences = DietaryPreferences()
    var blockedFoods: Set<String> = []

    var userProfile: UserProfile?
    var customDailyValues: [NutrientKey: Double] = [:]
    var personalization = PersonalizationSettings()

    var filteredFoods: [FoodItem] {
        var result = foods

        if !dietaryPreferences.active.isEmpty {
            result = result.filter { !isItemExcluded($0, preferences: dietaryPreferences) }
        }

        if !blockedFoods.isEmpty {
            result = result.filter { !blockedFoods.contains($0.name) }
        }

        if let type = selectedType {
            result = result.filter { $0.type == type }
        }

        if !selectedCategories.isEmpty {
            result = result.filter { selectedCategories.contains($0.category) }
        }

        if !searchQuery.isEmpty {
            let query = searchQuery.lowercased()
            result = result.filter { $0.name.lowercased().contains(query) }
        }

        return sortFoods(result)
    }

    var effectiveDailyValues: EffectiveDailyValues {
        getEffectiveDailyValues(profile: userProfile, overrides: customDailyValues)
    }

    var scoreConfig: ScoreConfig {
        if hasPersonalization(userProfile: userProfile, dietaryPrefs: dietaryPreferences, settings: personalization) {
            return computePersonalizedConfig(
                userProfile: userProfile,
                dietaryPrefs: dietaryPreferences,
                settings: personalization,
                baseConfig: defaultScoreConfig
            )
        }
        return defaultScoreConfig
    }

    func loadFoods() {
        guard foods.isEmpty, !loading else { return }
        loading = true
        error = nil
        do {
            foods = try CSVParser.loadFoods()
            loading = false
        } catch {
            self.error = error.localizedDescription
            loading = false
        }
    }

    func score(for food: FoodItem) -> Double? {
        computeNutrientDensityScore(
            item: food,
            selectedNutrients: scoreNutrients,
            dvMap: effectiveDailyValues,
            config: scoreConfig
        )
    }

    func toggleComparison(_ food: FoodItem) {
        if let index = comparisonFoods.firstIndex(of: food) {
            comparisonFoods.remove(at: index)
        } else if comparisonFoods.count < 3 {
            comparisonFoods.append(food)
        }
    }

    func togglePlanEntryLock(_ name: String) {
        if lockedPlanEntries.contains(name) {
            lockedPlanEntries.remove(name)
        } else {
            lockedPlanEntries.insert(name)
        }
    }

    func addPlanEntry(_ name: String) {
        guard !planEntries.contains(where: { $0.name == name }) else { return }
        planEntries.append(PlanEntry(name: name, servingsPerWeek: 7))
    }

    func removePlanEntry(_ name: String) {
        planEntries.removeAll { $0.name == name }
        lockedPlanEntries.remove(name)
    }

    func autoFillPlan() {
        let locked = planEntries.filter { lockedPlanEntries.contains($0.name) }
        let allowedFoods = foods.filter { !isItemExcluded($0, preferences: dietaryPreferences) && !blockedFoods.contains($0.name) }
        planEntries = generateAutoFillPlan(
            foods: allowedFoods,
            lockedEntries: locked,
            dvMap: effectiveDailyValues,
            budgetTolerance: budgetTolerance,
            lockedNutrients: lockedNutrients.isEmpty ? nil : lockedNutrients
        )
    }

    func planNutrientRows() -> [PlanNutrientRow] {
        computePlanDailyTotals(entries: planEntries, foods: foods, dvMap: effectiveDailyValues)
    }

    private func sortFoods(_ foods: [FoodItem]) -> [FoodItem] {
        let key = sort.key
        let ascending = sort.direction == .ascending

        if key == "name" {
            return foods.sorted { ascending ? $0.name < $1.name : $0.name > $1.name }
        }

        if key == "score" {
            return foods.sorted { a, b in
                let sa = score(for: a)
                let sb = score(for: b)
                if sa == nil && sb == nil { return false }
                if sa == nil { return false }
                if sb == nil { return true }
                return ascending ? sa! < sb! : sa! > sb!
            }
        }

        if let nutrientKey = NutrientKey(rawValue: key) {
            return foods.sorted { a, b in
                let va = a[nutrientKey]
                let vb = b[nutrientKey]
                if va == nil && vb == nil { return false }
                if va == nil { return false }
                if vb == nil { return true }
                return ascending ? va! < vb! : va! > vb!
            }
        }

        return foods
    }

    private static let preferencesKey = "appPreferences"

    func savePreferences() {
        let data: [String: Any] = [
            "dietary": Array(dietaryPreferences.active.map(\.rawValue)),
            "blocked": Array(blockedFoods),
            "budget": budgetTolerance,
            "scoreNutrients": Array(scoreNutrients.map(\.rawValue)),
            "lockedNutrients": Array(lockedNutrients.map(\.rawValue)),
        ]
        UserDefaults.standard.set(data, forKey: Self.preferencesKey)

        if let profile = userProfile {
            if let encoded = try? JSONEncoder().encode(profile) {
                UserDefaults.standard.set(encoded, forKey: "userProfile")
            }
        } else {
            UserDefaults.standard.removeObject(forKey: "userProfile")
        }

        if let encoded = try? JSONEncoder().encode(personalization) {
            UserDefaults.standard.set(encoded, forKey: "personalization")
        }

        if !customDailyValues.isEmpty {
            let dvData = Dictionary(uniqueKeysWithValues: customDailyValues.map { ($0.key.rawValue, $0.value) })
            UserDefaults.standard.set(dvData, forKey: "customDailyValues")
        }

        if !planEntries.isEmpty {
            if let encoded = try? JSONEncoder().encode(planEntries) {
                UserDefaults.standard.set(encoded, forKey: "planEntries")
            }
        }
    }

    func loadPreferences() {
        if let data = UserDefaults.standard.dictionary(forKey: Self.preferencesKey) {
            if let dietaryRaw = data["dietary"] as? [String] {
                dietaryPreferences.active = Set(dietaryRaw.compactMap { DietaryPreference(rawValue: $0) })
            }
            if let blocked = data["blocked"] as? [String] {
                blockedFoods = Set(blocked)
            }
            if let budget = data["budget"] as? Int {
                budgetTolerance = budget
            }
            if let scoreRaw = data["scoreNutrients"] as? [String] {
                scoreNutrients = Set(scoreRaw.compactMap { NutrientKey(rawValue: $0) })
            }
            if let lockedRaw = data["lockedNutrients"] as? [String] {
                lockedNutrients = Set(lockedRaw.compactMap { NutrientKey(rawValue: $0) })
            }
        }

        if let profileData = UserDefaults.standard.data(forKey: "userProfile"),
           let profile = try? JSONDecoder().decode(UserProfile.self, from: profileData) {
            userProfile = profile
        }

        if let personData = UserDefaults.standard.data(forKey: "personalization"),
           let settings = try? JSONDecoder().decode(PersonalizationSettings.self, from: personData) {
            personalization = settings
        }

        if let dvData = UserDefaults.standard.dictionary(forKey: "customDailyValues") as? [String: Double] {
            customDailyValues = Dictionary(uniqueKeysWithValues: dvData.compactMap { key, value in
                guard let k = NutrientKey(rawValue: key) else { return nil }
                return (k, value)
            })
        }

        if let planData = UserDefaults.standard.data(forKey: "planEntries"),
           let entries = try? JSONDecoder().decode([PlanEntry].self, from: planData) {
            planEntries = entries
        }
    }
}
