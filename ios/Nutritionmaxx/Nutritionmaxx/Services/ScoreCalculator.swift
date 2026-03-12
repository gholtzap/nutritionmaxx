import Foundation

struct ScoreConfig {
    var penaltyNutrients: Set<NutrientKey>
    var weights: [NutrientKey: Double]
    var minNutrientCount: Int
    var penaltyScale: Double
}

let defaultPenaltyNutrients: Set<NutrientKey> = [.sodiumMg]

let defaultDeficiencyWeights: [NutrientKey: Double] = [
    .potassiumMg: 2,
    .fiberG: 2,
    .vitaminDMcg: 1.5,
    .calciumMg: 1.5,
    .ironMg: 1.5,
]

let excludedFromScore: Set<NutrientKey> = [
    .caloriesKcal, .waterG, .fatG, .carbsG, .sugarsG,
]

let defaultScoreNutrients: Set<NutrientKey> = Set(
    nutrientMetaList
        .filter { $0.dailyValue != nil && !excludedFromScore.contains($0.key) && !defaultPenaltyNutrients.contains($0.key) }
        .map(\.key)
)

let defaultScoreConfig = ScoreConfig(
    penaltyNutrients: defaultPenaltyNutrients,
    weights: defaultDeficiencyWeights,
    minNutrientCount: 10,
    penaltyScale: 200
)

struct NutrientBreakdownEntry {
    let key: NutrientKey
    let percentDV: Double
    let weight: Double
    let baseWeight: Double
    let contribution: Double
    var sharePercent: Double
}

struct PenaltyEntry {
    let key: NutrientKey
    let percentDV: Double
}

struct ScoreBreakdown {
    let finalScore: Double
    let beneficialAvg: Double
    let penaltyMultiplier: Double
    let penaltyScale: Double
    let caloriesFactor: Double
    var nutrients: [NutrientBreakdownEntry]
    let penalties: [PenaltyEntry]
}

func computeNutrientDensityScore(
    item: FoodItem,
    selectedNutrients: Set<NutrientKey>,
    dvMap: [NutrientKey: Double?],
    config: ScoreConfig
) -> Double? {
    guard let calories = item.calories, calories > 0 else { return nil }

    var beneficialWeightedSum = 0.0
    var beneficialWeightSum = 0.0
    var beneficialCount = 0
    var penaltySum = 0.0
    var penaltyCount = 0

    for key in selectedNutrients {
        guard let value = item[key] else { continue }
        guard let dv = dvMap[key] ?? nutrientMetaMap[key]?.dailyValue, dv > 0 else { continue }
        let cappedDV = min((value / dv) * 100, 100)
        let weight = config.weights[key] ?? 1
        beneficialWeightedSum += cappedDV * weight
        beneficialWeightSum += weight
        beneficialCount += 1
    }

    for key in config.penaltyNutrients {
        guard let value = item[key] else { continue }
        guard let dv = dvMap[key] ?? nutrientMetaMap[key]?.dailyValue, dv > 0 else { continue }
        penaltySum += (value / dv) * 100
        penaltyCount += 1
    }

    guard beneficialCount >= config.minNutrientCount else { return nil }

    let beneficialAvg = beneficialWeightedSum / beneficialWeightSum
    let penaltyAvg = penaltyCount > 0 ? penaltySum / Double(penaltyCount) : 0
    let penaltyMultiplier = max(0, 1 - penaltyAvg / config.penaltyScale)

    return beneficialAvg * penaltyMultiplier * (100 / calories)
}

func computeScoreBreakdown(
    item: FoodItem,
    selectedNutrients: Set<NutrientKey>,
    dvMap: [NutrientKey: Double?],
    config: ScoreConfig,
    baseConfig: ScoreConfig
) -> ScoreBreakdown? {
    guard let calories = item.calories, calories > 0 else { return nil }

    var entries: [NutrientBreakdownEntry] = []
    var beneficialWeightedSum = 0.0
    var beneficialWeightSum = 0.0
    var beneficialCount = 0

    for key in selectedNutrients {
        guard let value = item[key] else { continue }
        guard let dv = dvMap[key] ?? nutrientMetaMap[key]?.dailyValue, dv > 0 else { continue }
        let percentDV = min((value / dv) * 100, 100)
        let weight = config.weights[key] ?? 1
        let baseWeight = baseConfig.weights[key] ?? 1
        let contribution = percentDV * weight
        entries.append(NutrientBreakdownEntry(
            key: key, percentDV: percentDV, weight: weight,
            baseWeight: baseWeight, contribution: contribution, sharePercent: 0
        ))
        beneficialWeightedSum += contribution
        beneficialWeightSum += weight
        beneficialCount += 1
    }

    var penalties: [PenaltyEntry] = []
    var penaltySum = 0.0
    var penaltyCount = 0

    for key in config.penaltyNutrients {
        guard let value = item[key] else { continue }
        guard let dv = dvMap[key] ?? nutrientMetaMap[key]?.dailyValue, dv > 0 else { continue }
        let percentDV = (value / dv) * 100
        penalties.append(PenaltyEntry(key: key, percentDV: percentDV))
        penaltySum += percentDV
        penaltyCount += 1
    }

    guard beneficialCount >= config.minNutrientCount else { return nil }

    let beneficialAvg = beneficialWeightedSum / beneficialWeightSum
    let penaltyAvg = penaltyCount > 0 ? penaltySum / Double(penaltyCount) : 0
    let penaltyMultiplier = max(0, 1 - penaltyAvg / config.penaltyScale)
    let caloriesFactor = 100 / calories
    let finalScore = beneficialAvg * penaltyMultiplier * caloriesFactor

    if beneficialWeightedSum > 0 {
        for i in entries.indices {
            entries[i].sharePercent = (entries[i].contribution / beneficialWeightedSum) * 100
        }
    }

    entries.sort { $0.contribution > $1.contribution }

    return ScoreBreakdown(
        finalScore: finalScore,
        beneficialAvg: beneficialAvg,
        penaltyMultiplier: penaltyMultiplier,
        penaltyScale: config.penaltyScale,
        caloriesFactor: caloriesFactor,
        nutrients: entries,
        penalties: penalties
    )
}
