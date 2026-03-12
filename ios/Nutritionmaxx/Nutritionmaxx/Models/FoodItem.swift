import Foundation

struct FoodItem: Identifiable, Hashable {
    let name: String
    let type: ItemType
    let category: ItemCategory
    let fdcId: String
    let servingSizeG: Double?
    let servingLabel: String?
    let costIndex: Double?
    let nutrients: [NutrientKey: Double]

    var id: String { name }

    subscript(key: NutrientKey) -> Double? {
        nutrients[key]
    }

    var calories: Double? { nutrients[.caloriesKcal] }
    var protein: Double? { nutrients[.proteinG] }
    var fat: Double? { nutrients[.fatG] }
    var carbs: Double? { nutrients[.carbsG] }
    var fiber: Double? { nutrients[.fiberG] }
    var sugars: Double? { nutrients[.sugarsG] }
    var water: Double? { nutrients[.waterG] }

    var servingMultiplier: Double {
        (servingSizeG ?? 100) / 100
    }

    func nutrientPerServing(_ key: NutrientKey) -> Double? {
        guard let value = nutrients[key] else { return nil }
        return value * servingMultiplier
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(name)
    }

    static func == (lhs: FoodItem, rhs: FoodItem) -> Bool {
        lhs.name == rhs.name
    }
}
