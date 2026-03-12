import Foundation

enum ItemType: String, CaseIterable, Codable, Hashable, Identifiable {
    case fruit
    case vegetable
    case spice
    case nutSeed = "nut_seed"
    case legume
    case grain
    case fishSeafood = "fish_seafood"
    case poultry
    case beef
    case pork
    case fatOil = "fat_oil"
    case dairy
    case egg
    case lamb

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .fruit: "Fruit"
        case .vegetable: "Vegetable"
        case .spice: "Spice"
        case .nutSeed: "Nuts & Seeds"
        case .legume: "Legume"
        case .grain: "Grain"
        case .fishSeafood: "Fish & Seafood"
        case .poultry: "Poultry"
        case .beef: "Beef"
        case .pork: "Pork"
        case .fatOil: "Fats & Oils"
        case .dairy: "Dairy"
        case .egg: "Egg"
        case .lamb: "Lamb"
        }
    }

    var systemImage: String {
        switch self {
        case .fruit: "apple.logo"
        case .vegetable: "leaf.fill"
        case .spice: "flame.fill"
        case .nutSeed: "tree.fill"
        case .legume: "circle.grid.3x3.fill"
        case .grain: "rectangle.split.3x3.fill"
        case .fishSeafood: "fish.fill"
        case .poultry: "bird.fill"
        case .beef: "rectangle.fill"
        case .pork: "rectangle.fill"
        case .fatOil: "drop.fill"
        case .dairy: "cup.and.saucer.fill"
        case .egg: "oval.fill"
        case .lamb: "rectangle.fill"
        }
    }
}

enum ItemCategory: String, CaseIterable, Codable, Hashable, Identifiable {
    case pome = "Pome"
    case citrus = "Citrus"
    case berry = "Berry"
    case stone = "Stone"
    case tropical = "Tropical"
    case melon = "Melon"
    case grape = "Grape"
    case root = "Root"
    case leafyGreen = "Leafy Green"
    case cruciferous = "Cruciferous"
    case legume = "Legume"
    case allium = "Allium"
    case nightshade = "Nightshade"
    case squash = "Squash"
    case herb = "Herb"
    case seed = "Seed"
    case pepper = "Pepper"
    case rootBark = "Root/Bark"
    case treeNut = "Tree Nut"
    case legumeNut = "Legume Nut"
    case bean = "Bean"
    case lentil = "Lentil"
    case pea = "Pea"
    case soy = "Soy"
    case rice = "Rice"
    case wheat = "Wheat"
    case ancientGrain = "Ancient Grain"
    case fish = "Fish"
    case crustacean = "Crustacean"
    case mollusk = "Mollusk"
    case chicken = "Chicken"
    case turkey = "Turkey"
    case otherPoultry = "Other Poultry"
    case ground = "Ground"
    case steak = "Steak"
    case otherCut = "Other Cut"
    case loin = "Loin"
    case shoulder = "Shoulder"
    case plantOil = "Plant Oil"
    case nutSeedOil = "Nut & Seed Oil"
    case animalFat = "Animal Fat"
    case processed = "Processed"
    case milk = "Milk"
    case yogurt = "Yogurt"
    case cheese = "Cheese"
    case cream = "Cream"
    case wholeEgg = "Whole Egg"
    case eggPart = "Egg Part"
    case otherEgg = "Other Egg"
    case leg = "Leg"
    case rib = "Rib"
    case shank = "Shank"
    case other = "Other"

    var id: String { rawValue }

    static func categories(for type: ItemType) -> [ItemCategory] {
        switch type {
        case .fruit: [.pome, .citrus, .berry, .stone, .tropical, .melon, .grape, .other]
        case .vegetable: [.root, .leafyGreen, .cruciferous, .legume, .allium, .nightshade, .squash, .other]
        case .spice: [.herb, .seed, .pepper, .rootBark, .other]
        case .nutSeed: [.treeNut, .seed, .legumeNut]
        case .legume: [.bean, .lentil, .pea, .soy]
        case .grain: [.rice, .wheat, .ancientGrain, .other]
        case .fishSeafood: [.fish, .crustacean, .mollusk]
        case .poultry: [.chicken, .turkey, .otherPoultry]
        case .beef: [.ground, .steak, .otherCut]
        case .pork: [.loin, .shoulder, .otherCut]
        case .fatOil: [.plantOil, .nutSeedOil, .animalFat, .processed]
        case .dairy: [.milk, .yogurt, .cheese, .cream]
        case .egg: [.wholeEgg, .eggPart, .otherEgg]
        case .lamb: [.ground, .leg, .loin, .shoulder, .rib, .shank]
        }
    }
}

enum NutrientKey: String, CaseIterable, Codable, Hashable, Identifiable {
    case caloriesKcal = "calories_kcal"
    case proteinG = "protein_g"
    case fatG = "fat_g"
    case carbsG = "carbs_g"
    case fiberG = "fiber_g"
    case sugarsG = "sugars_g"
    case waterG = "water_g"
    case vitaminAMcg = "vitamin_a_mcg"
    case vitaminB1Mg = "vitamin_b1_mg"
    case vitaminB2Mg = "vitamin_b2_mg"
    case vitaminB3Mg = "vitamin_b3_mg"
    case vitaminB5Mg = "vitamin_b5_mg"
    case vitaminB6Mg = "vitamin_b6_mg"
    case vitaminB9Mcg = "vitamin_b9_mcg"
    case vitaminB12Mcg = "vitamin_b12_mcg"
    case vitaminCMg = "vitamin_c_mg"
    case vitaminDMcg = "vitamin_d_mcg"
    case vitaminEMg = "vitamin_e_mg"
    case vitaminKMcg = "vitamin_k_mcg"
    case calciumMg = "calcium_mg"
    case ironMg = "iron_mg"
    case magnesiumMg = "magnesium_mg"
    case phosphorusMg = "phosphorus_mg"
    case potassiumMg = "potassium_mg"
    case sodiumMg = "sodium_mg"
    case zincMg = "zinc_mg"
    case copperMg = "copper_mg"
    case manganeseMg = "manganese_mg"
    case seleniumMcg = "selenium_mcg"

    var id: String { rawValue }
}

enum NutrientGroup: String, CaseIterable {
    case macro
    case vitamin
    case mineral
}

enum SortDirection {
    case ascending
    case descending
}

struct SortConfig {
    var key: String = "name"
    var direction: SortDirection = .ascending
}

enum ViewTab: String, CaseIterable, Identifiable {
    case explorer
    case compare
    case categories
    case planner
    case fixDiet
    case settings

    var id: String { rawValue }

    var label: String {
        switch self {
        case .explorer: "Explorer"
        case .compare: "Compare"
        case .categories: "Categories"
        case .planner: "Meal Plan"
        case .fixDiet: "Fix My Diet"
        case .settings: "Settings"
        }
    }

    var systemImage: String {
        switch self {
        case .explorer: "list.bullet"
        case .compare: "arrow.left.arrow.right"
        case .categories: "chart.bar.fill"
        case .planner: "calendar"
        case .fixDiet: "wand.and.stars"
        case .settings: "gearshape.fill"
        }
    }
}

struct PlanEntry: Identifiable, Codable, Hashable {
    var id: String { name }
    var name: String
    var servingsPerWeek: Int
}

enum HealthGoal: String, CaseIterable, Codable, Identifiable {
    case heart, bone, energy, immune, digestive
    var id: String { rawValue }

    var label: String {
        switch self {
        case .heart: "Heart"
        case .bone: "Bone"
        case .energy: "Energy"
        case .immune: "Immune"
        case .digestive: "Digestive"
        }
    }
}

enum ActivityLevel: String, CaseIterable, Codable, Identifiable {
    case sedentary, light, active, veryActive = "very_active"
    var id: String { rawValue }

    var label: String {
        switch self {
        case .sedentary: "Sedentary"
        case .light: "Light"
        case .active: "Active"
        case .veryActive: "Very Active"
        }
    }
}

enum LifeStage: String, CaseIterable, Codable, Identifiable {
    case defaultStage = "default"
    case pregnant, lactating, postmenopausal
    var id: String { rawValue }

    var label: String {
        switch self {
        case .defaultStage: "Default"
        case .pregnant: "Pregnant"
        case .lactating: "Lactating"
        case .postmenopausal: "Postmenopausal"
        }
    }
}

enum DietaryPattern: String, CaseIterable, Codable, Identifiable {
    case general, western, mediterranean
    case eastAsian = "east_asian"
    case southAsian = "south_asian"
    case latinAmerican = "latin_american"
    var id: String { rawValue }

    var label: String {
        switch self {
        case .general: "General"
        case .western: "Western"
        case .mediterranean: "Mediterranean"
        case .eastAsian: "East Asian"
        case .southAsian: "South Asian"
        case .latinAmerican: "Latin American"
        }
    }
}

struct PersonalizationSettings: Codable {
    var healthGoals: [HealthGoal] = []
    var activityLevel: ActivityLevel = .sedentary
    var lifeStage: LifeStage = .defaultStage
    var dietaryPattern: DietaryPattern = .general
}
