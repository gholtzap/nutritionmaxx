import Foundation

struct NutrientMeta: Identifiable {
    let key: NutrientKey
    let label: String
    let unit: String
    let decimals: Int
    let group: NutrientGroup
    let dailyValue: Double?

    var id: NutrientKey { key }

    func format(_ value: Double?) -> String {
        guard let value else { return "--" }
        return String(format: "%.\(decimals)f", value)
    }

    func formatWithUnit(_ value: Double?) -> String {
        guard let value else { return "--" }
        return "\(String(format: "%.\(decimals)f", value)) \(unit)"
    }

    func percentDV(_ value: Double?) -> Double? {
        guard let value, let dv = dailyValue, dv > 0 else { return nil }
        return (value / dv) * 100
    }
}

let nutrientMetaList: [NutrientMeta] = [
    NutrientMeta(key: .caloriesKcal, label: "Calories", unit: "kcal", decimals: 0, group: .macro, dailyValue: 2000),
    NutrientMeta(key: .proteinG, label: "Protein", unit: "g", decimals: 2, group: .macro, dailyValue: 50),
    NutrientMeta(key: .fatG, label: "Fat", unit: "g", decimals: 2, group: .macro, dailyValue: 78),
    NutrientMeta(key: .carbsG, label: "Carbs", unit: "g", decimals: 1, group: .macro, dailyValue: 275),
    NutrientMeta(key: .fiberG, label: "Fiber", unit: "g", decimals: 1, group: .macro, dailyValue: 28),
    NutrientMeta(key: .sugarsG, label: "Sugars", unit: "g", decimals: 1, group: .macro, dailyValue: 50),
    NutrientMeta(key: .waterG, label: "Water", unit: "g", decimals: 1, group: .macro, dailyValue: nil),
    NutrientMeta(key: .vitaminAMcg, label: "Vitamin A", unit: "mcg", decimals: 1, group: .vitamin, dailyValue: 900),
    NutrientMeta(key: .vitaminB1Mg, label: "Vitamin B1", unit: "mg", decimals: 3, group: .vitamin, dailyValue: 1.2),
    NutrientMeta(key: .vitaminB2Mg, label: "Vitamin B2", unit: "mg", decimals: 3, group: .vitamin, dailyValue: 1.3),
    NutrientMeta(key: .vitaminB3Mg, label: "Vitamin B3", unit: "mg", decimals: 3, group: .vitamin, dailyValue: 16),
    NutrientMeta(key: .vitaminB5Mg, label: "Vitamin B5", unit: "mg", decimals: 3, group: .vitamin, dailyValue: 5),
    NutrientMeta(key: .vitaminB6Mg, label: "Vitamin B6", unit: "mg", decimals: 3, group: .vitamin, dailyValue: 1.7),
    NutrientMeta(key: .vitaminB9Mcg, label: "Folate (B9)", unit: "mcg", decimals: 1, group: .vitamin, dailyValue: 400),
    NutrientMeta(key: .vitaminB12Mcg, label: "Vitamin B12", unit: "mcg", decimals: 2, group: .vitamin, dailyValue: 2.4),
    NutrientMeta(key: .vitaminCMg, label: "Vitamin C", unit: "mg", decimals: 1, group: .vitamin, dailyValue: 90),
    NutrientMeta(key: .vitaminDMcg, label: "Vitamin D", unit: "mcg", decimals: 1, group: .vitamin, dailyValue: 20),
    NutrientMeta(key: .vitaminEMg, label: "Vitamin E", unit: "mg", decimals: 2, group: .vitamin, dailyValue: 15),
    NutrientMeta(key: .vitaminKMcg, label: "Vitamin K", unit: "mcg", decimals: 1, group: .vitamin, dailyValue: 120),
    NutrientMeta(key: .calciumMg, label: "Calcium", unit: "mg", decimals: 1, group: .mineral, dailyValue: 1300),
    NutrientMeta(key: .ironMg, label: "Iron", unit: "mg", decimals: 2, group: .mineral, dailyValue: 18),
    NutrientMeta(key: .magnesiumMg, label: "Magnesium", unit: "mg", decimals: 1, group: .mineral, dailyValue: 420),
    NutrientMeta(key: .phosphorusMg, label: "Phosphorus", unit: "mg", decimals: 1, group: .mineral, dailyValue: 1250),
    NutrientMeta(key: .potassiumMg, label: "Potassium", unit: "mg", decimals: 1, group: .mineral, dailyValue: 4700),
    NutrientMeta(key: .sodiumMg, label: "Sodium", unit: "mg", decimals: 1, group: .mineral, dailyValue: 2300),
    NutrientMeta(key: .zincMg, label: "Zinc", unit: "mg", decimals: 2, group: .mineral, dailyValue: 11),
    NutrientMeta(key: .copperMg, label: "Copper", unit: "mg", decimals: 3, group: .mineral, dailyValue: 0.9),
    NutrientMeta(key: .manganeseMg, label: "Manganese", unit: "mg", decimals: 3, group: .mineral, dailyValue: 2.3),
    NutrientMeta(key: .seleniumMcg, label: "Selenium", unit: "mcg", decimals: 1, group: .mineral, dailyValue: 55),
]

let nutrientMetaMap: [NutrientKey: NutrientMeta] = Dictionary(
    uniqueKeysWithValues: nutrientMetaList.map { ($0.key, $0) }
)

let macroKeys: [NutrientKey] = nutrientMetaList.filter { $0.group == .macro }.map(\.key)
let vitaminKeys: [NutrientKey] = nutrientMetaList.filter { $0.group == .vitamin }.map(\.key)
let mineralKeys: [NutrientKey] = nutrientMetaList.filter { $0.group == .mineral }.map(\.key)
let allNutrientKeys: [NutrientKey] = nutrientMetaList.map(\.key)

let planNutrients: [NutrientMeta] = nutrientMetaList.filter { $0.dailyValue != nil }
