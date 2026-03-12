import Foundation

struct InteractionRule: Identifiable {
    let id: String
    let type: InteractionType
    let message: String
    let description: String
    let tip: String
    let nutrients: [NutrientKey]
    let suggestNutrient: NutrientKey?
    let check: ((_ pct: (NutrientKey) -> Double) -> Bool)
}

enum InteractionType: String {
    case enhancer, inhibitor, requirement
}

struct Insight: Identifiable {
    let id: String
    let type: InteractionType
    let message: String
    let nutrients: [NutrientKey]
    let suggestNutrient: NutrientKey?
}

let interactionRules: [InteractionRule] = [
    InteractionRule(
        id: "vitc-iron",
        type: .enhancer,
        message: "Vitamin C enhances non-heme iron absorption by up to 6x when consumed together",
        description: "Plant-based (non-heme) iron is poorly absorbed on its own. Vitamin C is the most potent known enhancer of non-heme iron absorption, with a log-linear dose-response.",
        tip: "Pair iron-rich plant foods (spinach, lentils, beans) with a vitamin C source at the same meal. As little as 25 mg of vitamin C meaningfully boosts absorption.",
        nutrients: [.ironMg, .vitaminCMg],
        suggestNutrient: .vitaminCMg,
        check: { pct in pct(.ironMg) >= 25 && pct(.vitaminCMg) < 50 }
    ),
    InteractionRule(
        id: "calcium-iron",
        type: .inhibitor,
        message: "High calcium can reduce iron absorption when consumed together",
        description: "Calcium inhibits both heme and non-heme iron absorption. Inhibition begins around 40 mg of calcium and reaches about 50-60% at 300-600 mg.",
        tip: "If you rely on plant-based iron, try to separate your highest-calcium foods from your highest-iron meals by 1-2 hours.",
        nutrients: [.calciumMg, .ironMg],
        suggestNutrient: nil,
        check: { pct in pct(.calciumMg) >= 50 && pct(.ironMg) >= 25 && pct(.ironMg) < 100 }
    ),
    InteractionRule(
        id: "vitd-calcium",
        type: .enhancer,
        message: "Vitamin D is needed to absorb calcium effectively",
        description: "Without adequate vitamin D, the body absorbs only 10-15% of dietary calcium. With sufficient vitamin D, absorption rises to 30-40%.",
        tip: "Ensure adequate vitamin D through sun exposure, fatty fish, fortified foods, or supplements.",
        nutrients: [.calciumMg, .vitaminDMcg],
        suggestNutrient: .vitaminDMcg,
        check: { pct in pct(.calciumMg) >= 25 && pct(.vitaminDMcg) < 50 }
    ),
    InteractionRule(
        id: "fat-soluble",
        type: .requirement,
        message: "Vitamins A, D, E, K are fat-soluble and need dietary fat for absorption",
        description: "Fat-soluble vitamins require incorporation into mixed micelles formed during fat digestion before they can cross the intestinal wall.",
        tip: "Include a source of fat when eating foods rich in vitamins A, D, E, or K. About 6-11 g of fat per meal is sufficient.",
        nutrients: [.vitaminAMcg, .vitaminDMcg, .vitaminEMg, .vitaminKMcg, .fatG],
        suggestNutrient: .fatG,
        check: { pct in
            let hasFatSoluble = pct(.vitaminAMcg) >= 25 || pct(.vitaminDMcg) >= 25 || pct(.vitaminEMg) >= 25 || pct(.vitaminKMcg) >= 25
            return hasFatSoluble && pct(.fatG) < 30
        }
    ),
    InteractionRule(
        id: "zinc-copper",
        type: .inhibitor,
        message: "Very high zinc can inhibit copper absorption",
        description: "Zinc and copper compete for absorption. Supplemental zinc doses above 40-50 mg/day can induce copper deficiency over weeks to months.",
        tip: "The tolerable upper intake level for zinc is 40 mg/day for adults. If taking high-dose zinc, consider a small copper supplement (1-2 mg/day).",
        nutrients: [.zincMg, .copperMg],
        suggestNutrient: .copperMg,
        check: { pct in pct(.zincMg) >= 150 && pct(.copperMg) < 75 }
    ),
    InteractionRule(
        id: "mag-vitd",
        type: .enhancer,
        message: "Magnesium is needed to activate vitamin D",
        description: "Vitamin D requires two magnesium-dependent hydroxylation steps to become the active hormone calcitriol.",
        tip: "If supplementing vitamin D, ensure adequate magnesium (310-420 mg/day). Good sources: pumpkin seeds, spinach, almonds, black beans.",
        nutrients: [.vitaminDMcg, .magnesiumMg],
        suggestNutrient: .magnesiumMg,
        check: { pct in pct(.vitaminDMcg) >= 25 && pct(.magnesiumMg) < 50 }
    ),
]

func analyzeInteractions(rows: [PlanNutrientRow]) -> [Insight] {
    let rowMap = Dictionary(uniqueKeysWithValues: rows.map { ($0.key, $0) })

    let pct: (NutrientKey) -> Double = { key in
        guard let row = rowMap[key], row.dailyValue > 0 else { return 0 }
        return (row.total / row.dailyValue) * 100
    }

    var insights: [Insight] = []
    for rule in interactionRules {
        if rule.check(pct) {
            insights.append(Insight(
                id: rule.id,
                type: rule.type,
                message: rule.message,
                nutrients: rule.nutrients,
                suggestNutrient: rule.suggestNutrient
            ))
        }
    }
    return insights
}

func findSuggestedFoods(
    nutrientKey: NutrientKey,
    foods: [FoodItem],
    excludeNames: Set<String>,
    count: Int = 3
) -> [FoodItem] {
    foods
        .filter { food in
            !excludeNames.contains(food.name) && (food[nutrientKey] ?? 0) > 0
        }
        .sorted { a, b in
            let aVal = (a[nutrientKey] ?? 0) * a.servingMultiplier
            let bVal = (b[nutrientKey] ?? 0) * b.servingMultiplier
            return aVal > bVal
        }
        .prefix(count)
        .map { $0 }
}
