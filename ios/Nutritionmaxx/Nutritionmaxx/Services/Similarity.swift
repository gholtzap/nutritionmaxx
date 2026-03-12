import Foundation

struct SimilarFood: Identifiable {
    let food: FoodItem
    let similarity: Double

    var id: String { food.name }
}

private let similarityNutrients = nutrientMetaList.filter {
    $0.dailyValue != nil && $0.key != .caloriesKcal
}

private let minSharedDimensions = 5

func findSimilarFoods(target: FoodItem, allFoods: [FoodItem], count: Int = 5) -> [SimilarFood] {
    var results: [SimilarFood] = []

    for food in allFoods {
        if food.name == target.name { continue }
        guard let similarity = cosineSimilarity(target, food) else { continue }
        results.append(SimilarFood(food: food, similarity: similarity))
    }

    results.sort { $0.similarity > $1.similarity }
    return Array(results.prefix(count))
}

private func cosineSimilarity(_ a: FoodItem, _ b: FoodItem) -> Double? {
    var dot = 0.0
    var magA = 0.0
    var magB = 0.0
    var shared = 0

    for meta in similarityNutrients {
        guard let va = a[meta.key], let vb = b[meta.key] else { continue }
        let dv = meta.dailyValue!
        let na = va / dv
        let nb = vb / dv
        dot += na * nb
        magA += na * na
        magB += nb * nb
        shared += 1
    }

    guard shared >= minSharedDimensions else { return nil }
    let denom = sqrt(magA) * sqrt(magB)
    guard denom > 0 else { return nil }
    return dot / denom
}
