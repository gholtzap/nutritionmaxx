import Foundation

private let weightCap = 3.0

private let sexWeights: [String: [NutrientKey: Double]] = [
    "male": [.zincMg: 1.1],
    "female_pre": [.ironMg: 1.3, .calciumMg: 1.2],
    "female_post": [:],
]

private let ageWeights: [String: [NutrientKey: Double]] = [
    "young": [.magnesiumMg: 1.1],
    "middle": [:],
    "senior": [.vitaminDMcg: 1.4, .vitaminB12Mcg: 1.2, .calciumMg: 1.2],
]

private let dietTypeWeights: [String: [NutrientKey: Double]] = [
    "vegan": [.vitaminB12Mcg: 2.0, .ironMg: 1.5, .zincMg: 1.4, .calciumMg: 1.4, .vitaminDMcg: 1.2],
    "vegetarian": [.vitaminB12Mcg: 1.6, .ironMg: 1.3, .zincMg: 1.2],
    "none": [:],
]

private struct PatternConfig {
    let weights: [NutrientKey: Double]
    let penaltyScale: Double
}

private let dietaryPatternConfig: [DietaryPattern: PatternConfig] = [
    .general: PatternConfig(weights: [:], penaltyScale: 200),
    .western: PatternConfig(weights: [.fiberG: 1.5, .potassiumMg: 1.3, .vitaminDMcg: 1.3, .calciumMg: 1.2, .magnesiumMg: 1.2], penaltyScale: 180),
    .mediterranean: PatternConfig(weights: [.vitaminDMcg: 1.2, .calciumMg: 1.1], penaltyScale: 200),
    .eastAsian: PatternConfig(weights: [.calciumMg: 1.5, .vitaminDMcg: 1.3], penaltyScale: 150),
    .southAsian: PatternConfig(weights: [.vitaminDMcg: 1.5, .ironMg: 1.3, .vitaminB12Mcg: 1.3, .calciumMg: 1.3], penaltyScale: 180),
    .latinAmerican: PatternConfig(weights: [.vitaminB9Mcg: 1.3, .vitaminDMcg: 1.2], penaltyScale: 200),
]

private struct GoalConfig {
    let weights: [NutrientKey: Double]
    let penaltyScale: Double
}

private let healthGoalConfig: [HealthGoal: GoalConfig] = [
    .heart: GoalConfig(weights: [.potassiumMg: 1.5, .fiberG: 1.3, .magnesiumMg: 1.3], penaltyScale: 150),
    .bone: GoalConfig(weights: [.calciumMg: 1.5, .vitaminDMcg: 1.5, .vitaminKMcg: 1.4, .magnesiumMg: 1.3, .phosphorusMg: 1.2], penaltyScale: 200),
    .energy: GoalConfig(weights: [.ironMg: 1.5, .vitaminB12Mcg: 1.4, .vitaminB6Mg: 1.3, .vitaminB9Mcg: 1.2], penaltyScale: 200),
    .immune: GoalConfig(weights: [.vitaminCMg: 1.4, .zincMg: 1.4, .vitaminDMcg: 1.3, .vitaminEMg: 1.2], penaltyScale: 200),
    .digestive: GoalConfig(weights: [.fiberG: 1.6, .magnesiumMg: 1.2], penaltyScale: 200),
]

private let activityWeights: [ActivityLevel: [NutrientKey: Double]] = [
    .sedentary: [:],
    .light: [.magnesiumMg: 1.1, .potassiumMg: 1.1],
    .active: [.magnesiumMg: 1.2, .potassiumMg: 1.2, .ironMg: 1.1],
    .veryActive: [.magnesiumMg: 1.3, .potassiumMg: 1.3, .ironMg: 1.2],
]

private struct LifeStageConfig {
    let weights: [NutrientKey: Double]
    let penaltyScale: Double?
}

private let lifeStageConfig: [LifeStage: LifeStageConfig] = [
    .defaultStage: LifeStageConfig(weights: [:], penaltyScale: nil),
    .pregnant: LifeStageConfig(weights: [.vitaminB9Mcg: 2.0, .ironMg: 1.8, .calciumMg: 1.5, .vitaminDMcg: 1.3], penaltyScale: 150),
    .lactating: LifeStageConfig(weights: [.vitaminDMcg: 1.5, .calciumMg: 1.4, .vitaminB12Mcg: 1.3], penaltyScale: 180),
    .postmenopausal: LifeStageConfig(weights: [.calciumMg: 1.6, .vitaminDMcg: 1.5, .vitaminKMcg: 1.3], penaltyScale: 200),
]

private func applyMultipliers(_ accumulated: inout [NutrientKey: Double], _ table: [NutrientKey: Double]) {
    for (key, mult) in table {
        let current = accumulated[key] ?? 1
        accumulated[key] = min(current * mult, weightCap)
    }
}

private func getAgeCategory(_ age: Int?) -> String {
    guard let age else { return "young" }
    if age <= 30 { return "young" }
    if age <= 50 { return "middle" }
    return "senior"
}

func computePersonalizedConfig(
    userProfile: UserProfile?,
    dietaryPrefs: DietaryPreferences,
    settings: PersonalizationSettings,
    baseConfig: ScoreConfig
) -> ScoreConfig {
    var multipliers: [NutrientKey: Double] = [:]
    var penaltyScales: [Double] = [baseConfig.penaltyScale]

    if let profile = userProfile {
        let isPostmenopausal = settings.lifeStage == .postmenopausal
        if profile.sex == .female {
            applyMultipliers(&multipliers, sexWeights[isPostmenopausal ? "female_post" : "female_pre"] ?? [:])
        } else {
            applyMultipliers(&multipliers, sexWeights["male"] ?? [:])
        }
        let ageCat = getAgeCategory(profile.age)
        applyMultipliers(&multipliers, ageWeights[ageCat] ?? [:])
    }

    if dietaryPrefs.active.contains(.vegan) {
        applyMultipliers(&multipliers, dietTypeWeights["vegan"] ?? [:])
    } else if dietaryPrefs.active.contains(.vegetarian) {
        applyMultipliers(&multipliers, dietTypeWeights["vegetarian"] ?? [:])
    }

    if let patternCfg = dietaryPatternConfig[settings.dietaryPattern] {
        applyMultipliers(&multipliers, patternCfg.weights)
        penaltyScales.append(patternCfg.penaltyScale)
    }

    for goal in settings.healthGoals {
        if let goalCfg = healthGoalConfig[goal] {
            applyMultipliers(&multipliers, goalCfg.weights)
            penaltyScales.append(goalCfg.penaltyScale)
        }
    }

    applyMultipliers(&multipliers, activityWeights[settings.activityLevel] ?? [:])

    if userProfile?.sex == .female && settings.lifeStage != .defaultStage {
        if let lsCfg = lifeStageConfig[settings.lifeStage] {
            applyMultipliers(&multipliers, lsCfg.weights)
            if let ps = lsCfg.penaltyScale {
                penaltyScales.append(ps)
            }
        }
    }

    var newWeights = baseConfig.weights
    for (key, mult) in multipliers {
        let baseWeight = baseConfig.weights[key] ?? 1
        newWeights[key] = min(baseWeight * mult, weightCap * baseWeight)
    }

    return ScoreConfig(
        penaltyNutrients: baseConfig.penaltyNutrients,
        weights: newWeights,
        minNutrientCount: baseConfig.minNutrientCount,
        penaltyScale: penaltyScales.min() ?? baseConfig.penaltyScale
    )
}

func hasPersonalization(
    userProfile: UserProfile?,
    dietaryPrefs: DietaryPreferences,
    settings: PersonalizationSettings
) -> Bool {
    if userProfile != nil { return true }
    if dietaryPrefs.active.contains(.vegan) || dietaryPrefs.active.contains(.vegetarian) { return true }
    if !settings.healthGoals.isEmpty { return true }
    if settings.activityLevel != .sedentary { return true }
    if settings.dietaryPattern != .general { return true }
    if settings.lifeStage != .defaultStage { return true }
    return false
}
