import Foundation

struct UserProfile: Codable {
    var sex: BiologicalSex
    var weightKg: Double
    var heightCm: Double
    var age: Int?

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
}

private enum AgeRange {
    case young, middle, senior
}

private func getAgeRange(_ age: Int?) -> AgeRange {
    guard let age else { return .young }
    if age <= 30 { return .young }
    if age <= 50 { return .middle }
    return .senior
}

private let sexAgeRDA: [UserProfile.BiologicalSex: [AgeRange: [NutrientKey: Double]]] = [
    .male: [
        .young: [
            .ironMg: 8, .magnesiumMg: 400, .zincMg: 11, .potassiumMg: 3400, .fiberG: 38,
            .vitaminAMcg: 900, .vitaminCMg: 90, .vitaminKMcg: 120, .manganeseMg: 2.3,
            .vitaminB1Mg: 1.2, .vitaminB2Mg: 1.3, .vitaminB3Mg: 16, .vitaminB6Mg: 1.3,
        ],
        .middle: [
            .ironMg: 8, .magnesiumMg: 420, .zincMg: 11, .potassiumMg: 3400, .fiberG: 38,
            .vitaminAMcg: 900, .vitaminCMg: 90, .vitaminKMcg: 120, .manganeseMg: 2.3,
            .vitaminB1Mg: 1.2, .vitaminB2Mg: 1.3, .vitaminB3Mg: 16, .vitaminB6Mg: 1.3,
        ],
        .senior: [
            .ironMg: 8, .magnesiumMg: 420, .zincMg: 11, .potassiumMg: 3400, .fiberG: 30,
            .vitaminAMcg: 900, .vitaminCMg: 90, .vitaminKMcg: 120, .manganeseMg: 2.3,
            .vitaminB1Mg: 1.2, .vitaminB2Mg: 1.3, .vitaminB3Mg: 16, .vitaminB6Mg: 1.7,
        ],
    ],
    .female: [
        .young: [
            .ironMg: 18, .magnesiumMg: 310, .zincMg: 8, .potassiumMg: 2600, .fiberG: 25,
            .vitaminAMcg: 700, .vitaminCMg: 75, .vitaminKMcg: 90, .manganeseMg: 1.8,
            .vitaminB1Mg: 1.1, .vitaminB2Mg: 1.1, .vitaminB3Mg: 14, .vitaminB6Mg: 1.3,
        ],
        .middle: [
            .ironMg: 18, .magnesiumMg: 320, .zincMg: 8, .potassiumMg: 2600, .fiberG: 25,
            .vitaminAMcg: 700, .vitaminCMg: 75, .vitaminKMcg: 90, .manganeseMg: 1.8,
            .vitaminB1Mg: 1.1, .vitaminB2Mg: 1.1, .vitaminB3Mg: 14, .vitaminB6Mg: 1.3,
        ],
        .senior: [
            .ironMg: 8, .magnesiumMg: 320, .zincMg: 8, .potassiumMg: 2600, .fiberG: 21,
            .vitaminAMcg: 700, .vitaminCMg: 75, .vitaminKMcg: 90, .manganeseMg: 1.8,
            .vitaminB1Mg: 1.1, .vitaminB2Mg: 1.1, .vitaminB3Mg: 14, .vitaminB6Mg: 1.5,
        ],
    ],
]

func computeProfileDailyValues(_ profile: UserProfile) -> [NutrientKey: Double] {
    var result: [NutrientKey: Double] = [:]
    let ageRange = getAgeRange(profile.age)

    if let rdaTable = sexAgeRDA[profile.sex]?[ageRange] {
        for (key, value) in rdaTable {
            result[key] = value
        }
    }

    result[.proteinG] = (profile.weightKg * 0.8).rounded()

    if let age = profile.age {
        let bmr: Double
        if profile.sex == .male {
            bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * Double(age) + 5
        } else {
            bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * Double(age) - 161
        }
        result[.caloriesKcal] = (bmr * 1.55).rounded()
    }

    return result
}

typealias EffectiveDailyValues = [NutrientKey: Double?]

func getEffectiveDailyValues(
    profile: UserProfile?,
    overrides: [NutrientKey: Double]
) -> EffectiveDailyValues {
    let profileValues = profile.map { computeProfileDailyValues($0) } ?? [:]
    var result: EffectiveDailyValues = [:]

    for meta in nutrientMetaList {
        if let override = overrides[meta.key] {
            result[meta.key] = override
            continue
        }
        if let profileValue = profileValues[meta.key] {
            result[meta.key] = profileValue
            continue
        }
        result[meta.key] = meta.dailyValue
    }

    return result
}

func resolveDV(_ meta: NutrientMeta, dvMap: EffectiveDailyValues?) -> Double? {
    if let dvMap, let val = dvMap[meta.key] {
        return val
    }
    return meta.dailyValue
}
