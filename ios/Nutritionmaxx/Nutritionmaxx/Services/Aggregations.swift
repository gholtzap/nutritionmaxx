import Foundation

struct CategoryAverage: Identifiable {
    let category: ItemCategory
    let count: Int
    let averages: [NutrientKey: Double?]

    var id: String { category.rawValue }
}

func computeCategoryAverages(
    foods: [FoodItem],
    nutrientKeys: [NutrientKey],
    categories: [ItemCategory]? = nil
) -> [CategoryAverage] {
    let cats = categories ?? ItemCategory.allCases
    var grouped: [ItemCategory: [FoodItem]] = [:]
    for cat in cats {
        grouped[cat] = []
    }

    for food in foods {
        grouped[food.category, default: []].append(food)
    }

    var result: [CategoryAverage] = []

    for cat in cats {
        let catFoods = grouped[cat] ?? []
        var averages: [NutrientKey: Double?] = [:]

        for key in nutrientKeys {
            let values = catFoods.compactMap { $0[key] }
            if values.isEmpty {
                averages[key] = nil
            } else {
                averages[key] = values.reduce(0, +) / Double(values.count)
            }
        }

        result.append(CategoryAverage(category: cat, count: catFoods.count, averages: averages))
    }

    return result.filter { $0.count > 0 }
}
