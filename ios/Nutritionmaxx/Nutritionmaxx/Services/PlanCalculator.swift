import Foundation

struct PlanNutrientRow: Identifiable {
    let key: NutrientKey
    let label: String
    let unit: String
    let group: NutrientGroup
    let dailyValue: Double
    let total: Double
    let nullCount: Int
    let insufficientData: Bool
    let note: String?

    var id: NutrientKey { key }

    var percentDV: Double {
        guard dailyValue > 0 else { return 0 }
        return (total / dailyValue) * 100
    }
}

private let insufficientThreshold = 0.5
private let excessThreshold = 2.0
private let excessPenalty = 0.3
private let forceInsufficient: Set<NutrientKey> = [.vitaminDMcg, .sodiumMg]

private let insufficientNotes: [NutrientKey: String] = [
    .sodiumMg: "Nearly every modern diet includes enough sodium; add salt to your cooking if you are deficient",
    .vitaminKMcg: "USDA does not supply this data",
    .vitaminDMcg: "Very few foods contain vitamin D, if you are deficient, get 20 minutes of sun on your arms and legs per day, eat salmon, or take supplements",
]

private func getInsufficientNutrients(_ foods: [FoodItem]) -> Set<NutrientKey> {
    var result = forceInsufficient
    guard !foods.isEmpty else { return result }
    for meta in planNutrients {
        var hasData = 0
        for food in foods {
            if food[meta.key] != nil { hasData += 1 }
        }
        if Double(hasData) / Double(foods.count) < insufficientThreshold {
            result.insert(meta.key)
        }
    }
    return result
}

func computePlanDailyTotals(
    entries: [PlanEntry],
    foods: [FoodItem],
    dvMap: EffectiveDailyValues? = nil
) -> [PlanNutrientRow] {
    let foodMap = Dictionary(uniqueKeysWithValues: foods.map { ($0.name, $0) })
    let insufficient = getInsufficientNutrients(foods)

    var totals: [NutrientKey: Double] = [:]
    var nullCounts: [NutrientKey: Int] = [:]

    for meta in planNutrients {
        totals[meta.key] = 0
        nullCounts[meta.key] = 0
    }

    for entry in entries {
        guard let food = foodMap[entry.name] else { continue }
        let servingG = food.servingSizeG ?? 100
        let dailyFactor = (servingG / 100) * (Double(entry.servingsPerWeek) / 7)
        for meta in planNutrients {
            if let raw = food[meta.key] {
                totals[meta.key, default: 0] += raw * dailyFactor
            } else {
                nullCounts[meta.key, default: 0] += 1
            }
        }
    }

    return planNutrients.map { meta in
        PlanNutrientRow(
            key: meta.key,
            label: meta.label,
            unit: meta.unit,
            group: meta.group,
            dailyValue: resolveDV(meta, dvMap: dvMap) ?? meta.dailyValue!,
            total: totals[meta.key] ?? 0,
            nullCount: nullCounts[meta.key] ?? 0,
            insufficientData: insufficient.contains(meta.key),
            note: insufficientNotes[meta.key]
        )
    }
}

private let typeMax: [ItemType: Int] = [
    .grain: 14, .fatOil: 14, .legume: 7, .poultry: 7, .beef: 7, .pork: 7,
    .fishSeafood: 3, .fruit: 7, .vegetable: 7, .nutSeed: 5, .dairy: 7,
    .egg: 7, .lamb: 7, .spice: 3,
]

private let categoryMax: [ItemCategory: Int] = [
    .ancientGrain: 3, .wheat: 0, .animalFat: 7, .other: 5, .otherCut: 3,
    .mollusk: 2, .crustacean: 3,
]

private let itemMax: [String: Int] = [
    "Shortening": 0, "Chicken Liver": 1, "Fava Bean": 3,
    "Rutabaga": 3, "Mung Bean": 3, "Ribeye Steak": 2,
]

private func maxServingsFor(_ food: FoodItem) -> Int {
    if let cap = itemMax[food.name] { return cap }
    if let cap = categoryMax[food.category] { return cap }
    return typeMax[food.type] ?? 7
}

private let lockedNutrientBoost = 3.0
private let maxCalorieFillers = 3
private let topN = 5
private let diversityDecay = 0.7

private struct ScoredCandidate {
    let food: FoodItem
    var score: Double
    let servings: Int
}

private func scoreCandidate(
    food: FoodItem,
    totals: [NutrientKey: Double],
    insufficient: Set<NutrientKey>,
    dvMap: EffectiveDailyValues?,
    lockedNutrients: Set<NutrientKey>?
) -> ScoredCandidate? {
    let servingG = food.servingSizeG ?? 100
    var perNutrientServings: [Double] = []
    var nullCount = 0
    let sufficientCount = planNutrients.count - insufficient.count

    for meta in planNutrients {
        if insufficient.contains(meta.key) { continue }
        guard let raw = food[meta.key] else {
            nullCount += 1
            continue
        }
        let perServing = raw * (servingG / 100)
        guard perServing > 0 else { continue }
        let dv = resolveDV(meta, dvMap: dvMap) ?? meta.dailyValue!
        let rem = max(0, dv - (totals[meta.key] ?? 0))
        guard rem > 0 else { continue }
        perNutrientServings.append(rem / perServing)
    }

    guard !perNutrientServings.isEmpty else { return nil }

    perNutrientServings.sort()
    let median = perNutrientServings[perNutrientServings.count / 2]
    let cap = maxServingsFor(food)
    let servings = max(1, min(cap, Int((median * 7).rounded())))

    let dailyFactor = (servingG / 100) * (Double(servings) / 7)
    var score = 0.0

    for meta in planNutrients {
        if insufficient.contains(meta.key) { continue }
        guard let raw = food[meta.key] else { continue }
        let contribution = raw * dailyFactor
        let total = totals[meta.key] ?? 0
        let dv = resolveDV(meta, dvMap: dvMap) ?? meta.dailyValue!
        let rem = max(0, dv - total)
        let isLocked = lockedNutrients?.contains(meta.key) == true && total < dv
        let weight = isLocked ? lockedNutrientBoost : 1.0

        if rem > 0 {
            score += (min(contribution, rem) / dv) * weight
        }
        let dvCap = dv * excessThreshold
        let addedExcess = max(0, total + contribution - dvCap) - max(0, total - dvCap)
        if addedExcess > 0 {
            score -= (addedExcess / dv) * excessPenalty
        }
    }

    let nullPenalty = sufficientCount > 0 ? 1 - (Double(nullCount) / Double(sufficientCount)) * 0.5 : 1
    score *= nullPenalty
    guard score > 0 else { return nil }

    return ScoredCandidate(food: food, score: score, servings: servings)
}

private func weightedRandomPick(_ candidates: [ScoredCandidate]) -> ScoredCandidate {
    let total = candidates.reduce(0) { $0 + $1.score }
    var r = Double.random(in: 0..<total)
    for c in candidates {
        r -= c.score
        if r <= 0 { return c }
    }
    return candidates.last!
}

private func applySelection(_ picked: ScoredCandidate, _ totals: inout [NutrientKey: Double]) {
    let servingG = picked.food.servingSizeG ?? 100
    let dailyFactor = (servingG / 100) * (Double(picked.servings) / 7)
    for meta in planNutrients {
        guard let raw = picked.food[meta.key] else { continue }
        totals[meta.key, default: 0] += raw * dailyFactor
    }
}

private func calsPerServing(_ food: FoodItem) -> Double {
    guard let cals = food.calories, cals > 0 else { return 0 }
    return cals * food.servingMultiplier
}

private func planDailyCals(_ plan: [PlanEntry], _ foodMap: [String: FoodItem]) -> Double {
    var total = 0.0
    for entry in plan {
        guard let food = foodMap[entry.name] else { continue }
        total += calsPerServing(food) * (Double(entry.servingsPerWeek) / 7)
    }
    return total
}

private func boostCalories(
    _ plan: inout [PlanEntry],
    lockedNames: Set<String>,
    foodMap: [String: FoodItem],
    pool: [FoodItem],
    used: inout Set<String>,
    calorieDV: Double
) {
    var totalCals = planDailyCals(plan, foodMap)
    if totalCals >= calorieDV || totalCals <= 0 { return }

    let boostable = plan.indices.filter { i in
        !lockedNames.contains(plan[i].name) &&
        foodMap[plan[i].name].map { plan[i].servingsPerWeek < maxServingsFor($0) } == true
    }

    if !boostable.isEmpty {
        var boostableCals = 0.0
        for i in boostable {
            guard let food = foodMap[plan[i].name] else { continue }
            boostableCals += calsPerServing(food) * (Double(plan[i].servingsPerWeek) / 7)
        }
        if boostableCals > 0 {
            let scale = (boostableCals + (calorieDV - totalCals)) / boostableCals
            for i in boostable {
                guard let food = foodMap[plan[i].name] else { continue }
                plan[i].servingsPerWeek = min(maxServingsFor(food), Int((Double(plan[i].servingsPerWeek) * scale).rounded()))
            }
        }
    }

    totalCals = planDailyCals(plan, foodMap)
    if totalCals >= calorieDV { return }

    let fillers = pool
        .filter { !used.contains($0.name) && calsPerServing($0) > 0 }
        .sorted { calsPerServing($0) > calsPerServing($1) }

    var added = 0
    for food in fillers {
        if added >= maxCalorieFillers { break }
        let deficit = calorieDV - totalCals
        if deficit <= 0 { break }
        let cps = calsPerServing(food)
        let dailyServings = deficit / cps
        let cap = maxServingsFor(food)
        let spw = min(cap, max(1, Int((dailyServings * 7).rounded())))
        plan.append(PlanEntry(name: food.name, servingsPerWeek: spw))
        used.insert(food.name)
        totalCals += cps * (Double(spw) / 7)
        added += 1
    }
}

private func nutrientTotal(_ plan: [PlanEntry], _ foodMap: [String: FoodItem], _ key: NutrientKey) -> Double {
    var total = 0.0
    for entry in plan {
        guard let food = foodMap[entry.name], let raw = food[key] else { continue }
        total += raw * food.servingMultiplier * (Double(entry.servingsPerWeek) / 7)
    }
    return total
}

private func nutrientDensity(_ food: FoodItem, _ key: NutrientKey) -> Double {
    guard let raw = food[key], raw > 0 else { return 0 }
    return raw * food.servingMultiplier
}

private func boostLockedNutrients(
    _ plan: inout [PlanEntry],
    lockedEntryNames: Set<String>,
    foodMap: [String: FoodItem],
    pool: [FoodItem],
    used: inout Set<String>,
    lockedNutrients: Set<NutrientKey>,
    insufficient: Set<NutrientKey>,
    dvMap: EffectiveDailyValues?
) {
    for nutrientKey in lockedNutrients {
        if insufficient.contains(nutrientKey) { continue }
        guard let meta = planNutrients.first(where: { $0.key == nutrientKey }) else { continue }
        let dv = resolveDV(meta, dvMap: dvMap) ?? meta.dailyValue!
        guard dv > 0 else { continue }

        var total = nutrientTotal(plan, foodMap, nutrientKey)
        if total >= dv { continue }

        var boostable = plan.indices.filter { i in
            !lockedEntryNames.contains(plan[i].name) &&
            foodMap[plan[i].name].map { plan[i].servingsPerWeek < maxServingsFor($0) && nutrientDensity($0, nutrientKey) > 0 } == true
        }
        boostable.sort { a, b in
            nutrientDensity(foodMap[plan[a].name]!, nutrientKey) > nutrientDensity(foodMap[plan[b].name]!, nutrientKey)
        }

        for i in boostable {
            if total >= dv { break }
            let food = foodMap[plan[i].name]!
            let perServing = nutrientDensity(food, nutrientKey)
            let deficit = dv - total
            let spwNeeded = Int(ceil((deficit / perServing) * 7))
            let cap = maxServingsFor(food)
            let newSpw = min(cap, plan[i].servingsPerWeek + spwNeeded)
            let added = newSpw - plan[i].servingsPerWeek
            if added > 0 {
                plan[i].servingsPerWeek = newSpw
                total += perServing * (Double(added) / 7)
            }
        }

        if total >= dv { continue }

        let candidates = pool
            .filter { !used.contains($0.name) && nutrientDensity($0, nutrientKey) > 0 }
            .sorted { nutrientDensity($0, nutrientKey) > nutrientDensity($1, nutrientKey) }

        for food in candidates {
            if total >= dv { break }
            let perServing = nutrientDensity(food, nutrientKey)
            let deficit = dv - total
            let cap = maxServingsFor(food)
            let spw = min(cap, max(1, Int(ceil((deficit / perServing) * 7))))
            plan.append(PlanEntry(name: food.name, servingsPerWeek: spw))
            used.insert(food.name)
            total += perServing * (Double(spw) / 7)
        }
    }
}

func generateAutoFillPlan(
    foods: [FoodItem],
    lockedEntries: [PlanEntry] = [],
    maxEntries: Int = 15,
    dvMap: EffectiveDailyValues? = nil,
    budgetTolerance: Int = 10,
    lockedNutrients: Set<NutrientKey>? = nil
) -> [PlanEntry] {
    let pool = foods.filter { $0.type != .spice && ($0.costIndex == nil || $0.costIndex! <= Double(budgetTolerance)) }
    let foodMap = Dictionary(uniqueKeysWithValues: foods.map { ($0.name, $0) })
    let insufficient = getInsufficientNutrients(foods)

    var totals: [NutrientKey: Double] = [:]
    for meta in planNutrients {
        totals[meta.key] = 0
    }

    var plan = lockedEntries
    var used = Set(lockedEntries.map(\.name))
    var typeCounts: [ItemType: Int] = [:]

    for entry in lockedEntries {
        guard let food = foodMap[entry.name] else { continue }
        typeCounts[food.type, default: 0] += 1
        let servingG = food.servingSizeG ?? 100
        let dailyFactor = (servingG / 100) * (Double(entry.servingsPerWeek) / 7)
        for meta in planNutrients {
            guard let raw = food[meta.key] else { continue }
            totals[meta.key, default: 0] += raw * dailyFactor
        }
    }

    let slotsToFill = maxEntries - lockedEntries.count

    for _ in 0..<slotsToFill {
        var scored: [ScoredCandidate] = []

        for food in pool {
            if used.contains(food.name) { continue }
            guard var result = scoreCandidate(food: food, totals: totals, insufficient: insufficient, dvMap: dvMap, lockedNutrients: lockedNutrients) else { continue }
            let count = typeCounts[food.type] ?? 0
            result.score *= pow(diversityDecay, Double(count))
            scored.append(result)
        }

        if scored.isEmpty { break }

        scored.sort { $0.score > $1.score }
        let hasUnmetLocked = lockedNutrients.map { locked in
            locked.contains { key in
                guard !insufficient.contains(key) else { return false }
                guard let meta = planNutrients.first(where: { $0.key == key }) else { return false }
                let dv = resolveDV(meta, dvMap: dvMap) ?? meta.dailyValue!
                return (totals[key] ?? 0) < dv
            }
        } ?? false

        let picked = hasUnmetLocked ? scored[0] : weightedRandomPick(Array(scored.prefix(topN)))

        plan.append(PlanEntry(name: picked.food.name, servingsPerWeek: picked.servings))
        used.insert(picked.food.name)
        typeCounts[picked.food.type, default: 0] += 1
        applySelection(picked, &totals)
    }

    let lockedNames = Set(lockedEntries.map(\.name))

    if let lockedNutrients, !lockedNutrients.isEmpty {
        boostLockedNutrients(&plan, lockedEntryNames: lockedNames, foodMap: foodMap, pool: pool, used: &used, lockedNutrients: lockedNutrients, insufficient: insufficient, dvMap: dvMap)
    }

    if let calorieMeta = planNutrients.first(where: { $0.key == .caloriesKcal }) {
        let calorieDV = resolveDV(calorieMeta, dvMap: dvMap) ?? calorieMeta.dailyValue!
        boostCalories(&plan, lockedNames: lockedNames, foodMap: foodMap, pool: pool, used: &used, calorieDV: calorieDV)
    }

    return plan
}
