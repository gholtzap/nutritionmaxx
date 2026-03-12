import Foundation

enum BiologicalSex: String, CaseIterable, Codable, Identifiable {
    case male, female
    var id: String { rawValue }
    var label: String {
        switch self {
        case .male: "Male"
        case .female: "Female"
        }
    }
}

enum WizardAgeRange: String, CaseIterable, Codable, Identifiable {
    case young = "19-30"
    case middle = "31-50"
    case senior = "51+"
    var id: String { rawValue }
    var label: String { rawValue }
}

enum DietPattern: String, CaseIterable, Codable, Identifiable {
    case omnivore, pescatarian, vegetarian, vegan
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum HealthFocus: String, CaseIterable, Codable, Identifiable {
    case heart, bone, energy, gut, immune
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum PregnancyStatus: String, CaseIterable, Codable, Identifiable {
    case pregnant, breastfeeding
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum LifestyleFactor: String, CaseIterable, Codable, Identifiable {
    case smoker, alcohol, caffeine
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum Symptom: String, CaseIterable, Codable, Identifiable {
    case fatigue, cramps, bruising, colds
    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum FamilyCondition: String, CaseIterable, Codable, Identifiable {
    case osteoporosis
    case heartDisease = "heart_disease"
    case neurodegeneration
    case diabetes
    var id: String { rawValue }
    var label: String {
        switch self {
        case .osteoporosis: "Osteoporosis"
        case .heartDisease: "Heart Disease"
        case .neurodegeneration: "Neurodegeneration"
        case .diabetes: "Diabetes"
        }
    }
}

struct WizardAnswers {
    var sex: BiologicalSex = .male
    var ageRange: WizardAgeRange = .young
    var dietPattern: DietPattern = .omnivore
    var healthFocus: Set<HealthFocus> = []
    var pregnancyStatus: PregnancyStatus?
    var lifestyleFactors: Set<LifestyleFactor> = []
    var symptoms: Set<Symptom> = []
    var familyHistory: Set<FamilyCondition> = []
}

struct ScoredFood: Identifiable {
    let food: FoodItem
    let score: Double
    let topNutrients: [(key: NutrientKey, label: String, percentDV: Int)]

    var id: String { food.name }
}

typealias DeficiencyWeights = [NutrientKey: Double]

private let baselineWeights: [NutrientKey: Double] = [
    .fiberG: 0.3, .potassiumMg: 0.3, .magnesiumMg: 0.25,
    .vitaminEMg: 0.2, .vitaminCMg: 0.15, .calciumMg: 0.2, .vitaminAMcg: 0.15,
]

private let dietPatternWeights: [DietPattern: [NutrientKey: Double]] = [
    .omnivore: [:],
    .pescatarian: [.ironMg: 0.15, .zincMg: 0.1],
    .vegetarian: [.vitaminB12Mcg: 0.4, .ironMg: 0.3, .zincMg: 0.2, .calciumMg: 0.15, .proteinG: 0.15, .seleniumMcg: 0.1],
    .vegan: [.vitaminB12Mcg: 0.6, .ironMg: 0.35, .zincMg: 0.3, .calciumMg: 0.3, .proteinG: 0.25, .seleniumMcg: 0.2, .vitaminB2Mg: 0.15],
]

private let sexAgeWeights: [String: [NutrientKey: Double]] = [
    "female:19-30": [.ironMg: 0.3, .vitaminB9Mcg: 0.2],
    "female:31-50": [.ironMg: 0.3, .vitaminB9Mcg: 0.2],
    "female:51+": [.vitaminB12Mcg: 0.2, .calciumMg: 0.2],
    "male:51+": [.vitaminB12Mcg: 0.15, .calciumMg: 0.15],
]

private let healthFocusWeights: [HealthFocus: [NutrientKey: Double]] = [
    .heart: [.potassiumMg: 0.3, .magnesiumMg: 0.25, .fiberG: 0.2, .vitaminB9Mcg: 0.15],
    .bone: [.calciumMg: 0.35, .vitaminKMcg: 0.25, .magnesiumMg: 0.2, .phosphorusMg: 0.1],
    .energy: [.ironMg: 0.3, .vitaminB12Mcg: 0.25, .vitaminB6Mg: 0.2, .magnesiumMg: 0.15, .vitaminB1Mg: 0.15],
    .gut: [.fiberG: 0.4, .magnesiumMg: 0.15, .potassiumMg: 0.1],
    .immune: [.vitaminCMg: 0.35, .zincMg: 0.25, .vitaminAMcg: 0.2, .seleniumMcg: 0.15, .vitaminEMg: 0.1],
]

private let pregnancyWeights: [PregnancyStatus: [NutrientKey: Double]] = [
    .pregnant: [.vitaminB9Mcg: 0.4, .ironMg: 0.35, .calciumMg: 0.25, .zincMg: 0.2],
    .breastfeeding: [.calciumMg: 0.3, .vitaminB9Mcg: 0.3, .vitaminAMcg: 0.2, .zincMg: 0.2],
]

private let lifestyleWeights: [LifestyleFactor: [NutrientKey: Double]] = [
    .smoker: [.vitaminCMg: 0.3, .vitaminEMg: 0.15, .vitaminAMcg: 0.1],
    .alcohol: [.vitaminB1Mg: 0.25, .vitaminB9Mcg: 0.2, .magnesiumMg: 0.15, .zincMg: 0.1],
    .caffeine: [.ironMg: 0.2, .calciumMg: 0.2, .magnesiumMg: 0.1],
]

private let symptomWeights: [Symptom: [NutrientKey: Double]] = [
    .fatigue: [.ironMg: 0.25, .vitaminB12Mcg: 0.25, .vitaminB6Mg: 0.15, .magnesiumMg: 0.1],
    .cramps: [.magnesiumMg: 0.3, .potassiumMg: 0.25, .calciumMg: 0.2],
    .bruising: [.vitaminCMg: 0.3, .vitaminKMcg: 0.25],
    .colds: [.vitaminCMg: 0.25, .zincMg: 0.2, .vitaminAMcg: 0.15, .seleniumMcg: 0.1],
]

private let familyHistoryWeights: [FamilyCondition: [NutrientKey: Double]] = [
    .osteoporosis: [.calciumMg: 0.3, .vitaminKMcg: 0.2, .magnesiumMg: 0.15, .phosphorusMg: 0.1],
    .heartDisease: [.potassiumMg: 0.25, .magnesiumMg: 0.2, .fiberG: 0.2, .vitaminB9Mcg: 0.15],
    .neurodegeneration: [.vitaminEMg: 0.25, .vitaminB9Mcg: 0.2, .vitaminB12Mcg: 0.2, .vitaminB6Mg: 0.15],
    .diabetes: [.fiberG: 0.3, .magnesiumMg: 0.25, .potassiumMg: 0.15, .zincMg: 0.1],
]

private let omega3BonusFoods: Set<String> = [
    "Flaxseed", "Chia Seeds", "Walnuts", "Hemp Seeds",
    "Salmon", "Sardines", "Mackerel", "Trout", "Herring",
]

private let uncommonDiscount: [String: Double] = [
    "Beef Liver": 0.001, "Chicken Liver": 0.001, "Pork Liver": 0.001,
    "Duck": 0.4, "Duck Egg": 0.4, "Cornish Hen": 0.1, "Pawpaw": 0.2,
    "Teff": 0.2, "Pork Belly": 0.3, "Amaranth": 0.2, "Sorghum": 0.2,
    "Rutabaga": 0.2, "Tomatillo": 0.5, "Squid": 0.5, "Mussel": 0.5,
    "Oyster": 0.5, "Soybean": 0.5, "Millet": 0.5, "Buckwheat": 0.5,
    "Durum Wheat": 0.5, "Spelt": 0.5, "Clam": 0.5, "Scallop": 0.5,
    "Lobster": 0.5, "Great Northern Bean": 0.5, "Navy Bean": 0.5,
    "Split Pea": 0.5, "Herring": 0.2, "Anchovy": 0.5, "Mackerel": 0.5,
    "Adzuki Bean": 0.3, "Fava Bean": 0.3, "Mung Bean": 0.3,
    "Collard Greens": 0.8, "Parsnip": 0.6, "Fennel": 0.6,
    "Bok Choy": 0.6, "Crab (King)": 0.6, "Wild Rice": 0.6,
]

private let excludedDeficiencyNutrients: Set<NutrientKey> = [
    .vitaminDMcg, .sodiumMg, .waterG, .sugarsG, .caloriesKcal, .fatG, .carbsG,
]

private func addWeights(_ target: inout DeficiencyWeights, _ source: [NutrientKey: Double]) {
    for (key, value) in source {
        if excludedDeficiencyNutrients.contains(key) { continue }
        target[key] = min(1, (target[key] ?? 0) + value)
    }
}

func buildDeficiencyProfile(_ answers: WizardAnswers) -> DeficiencyWeights {
    var weights: DeficiencyWeights = [:]
    addWeights(&weights, baselineWeights)
    addWeights(&weights, dietPatternWeights[answers.dietPattern] ?? [:])

    let sexAgeKey = "\(answers.sex.rawValue):\(answers.ageRange.rawValue)"
    if let w = sexAgeWeights[sexAgeKey] {
        addWeights(&weights, w)
    }

    for focus in answers.healthFocus {
        addWeights(&weights, healthFocusWeights[focus] ?? [:])
    }

    if let status = answers.pregnancyStatus {
        addWeights(&weights, pregnancyWeights[status] ?? [:])
    }

    for factor in answers.lifestyleFactors {
        addWeights(&weights, lifestyleWeights[factor] ?? [:])
    }

    for symptom in answers.symptoms {
        addWeights(&weights, symptomWeights[symptom] ?? [:])
    }

    for condition in answers.familyHistory {
        addWeights(&weights, familyHistoryWeights[condition] ?? [:])
    }

    return weights
}

func getTopDeficiencies(_ profile: DeficiencyWeights, count: Int) -> [(key: NutrientKey, label: String, weight: Double)] {
    profile.sorted { $0.value > $1.value }
        .prefix(count)
        .map { (key: $0.key, label: nutrientMetaMap[$0.key]?.label ?? $0.key.rawValue, weight: $0.value) }
}

private let dvMap = Dictionary(uniqueKeysWithValues: nutrientMetaList.compactMap { m -> (NutrientKey, Double)? in
    guard let dv = m.dailyValue else { return nil }
    return (m.key, dv)
})

private func getPercentDV(_ food: FoodItem, _ key: NutrientKey, _ servingMultiplier: Double) -> Double {
    guard let raw = food[key], let dv = dvMap[key], dv > 0 else { return 0 }
    return (raw * servingMultiplier / dv) * 100
}

private func scoreFood(_ food: FoodItem, _ weights: DeficiencyWeights) -> (score: Double, nutrients: [(key: NutrientKey, pctDV: Double)]) {
    let multiplier = food.servingMultiplier
    var score = 0.0
    var nutrients: [(key: NutrientKey, pctDV: Double)] = []

    for (key, weight) in weights {
        let pctDV = getPercentDV(food, key, multiplier)
        if pctDV > 0 {
            score += (pctDV / 100) * weight
            nutrients.append((key: key, pctDV: pctDV))
        }
    }

    if omega3BonusFoods.contains(food.name) {
        score += 0.15
    }

    if let discount = uncommonDiscount[food.name] {
        score *= discount
    }

    return (score, nutrients)
}

func scoreFoodsForDeficiencies(_ foods: [FoodItem], _ profile: DeficiencyWeights, maxResults: Int = 3) -> [ScoredFood] {
    let eligible = foods.filter { $0.type != .spice && $0.type != .fatOil }
    var remainingWeights = profile
    var results: [ScoredFood] = []
    var usedTypes: Set<ItemType> = []
    var usedFoods: Set<String> = []

    for _ in 0..<maxResults {
        var best: (food: FoodItem, score: Double, nutrients: [(key: NutrientKey, pctDV: Double)])?

        for food in eligible {
            if usedFoods.contains(food.name) { continue }
            var (score, nutrients) = scoreFood(food, remainingWeights)
            if usedTypes.contains(food.type) {
                score *= 0.6
            }
            if score > 0.05 && (best == nil || score > best!.score) {
                best = (food, score, nutrients)
            }
        }

        guard let chosen = best else { break }

        let topNutrients = chosen.nutrients
            .sorted { $0.pctDV > $1.pctDV }
            .prefix(4)
            .map { (key: $0.key, label: nutrientMetaMap[$0.key]?.label ?? $0.key.rawValue, percentDV: Int($0.pctDV.rounded())) }

        results.append(ScoredFood(food: chosen.food, score: chosen.score, topNutrients: topNutrients))
        usedFoods.insert(chosen.food.name)
        usedTypes.insert(chosen.food.type)

        for (key, pctDV) in chosen.nutrients {
            guard let currentWeight = remainingWeights[key] else { continue }
            let coverage = min(pctDV / 100, 1)
            let reduction = coverage * 0.8
            let newWeight = currentWeight * (1 - reduction)
            if newWeight < 0.01 {
                remainingWeights.removeValue(forKey: key)
            } else {
                remainingWeights[key] = newWeight
            }
        }
    }

    return results
}
