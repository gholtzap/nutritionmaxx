import Foundation

enum DietaryPreference: String, CaseIterable, Codable, Identifiable {
    case vegetarian, vegan, pescatarian, halal, kosher
    case nutFree = "nut_free"
    case peanutFree = "peanut_free"
    case shellfishFree = "shellfish_free"
    case soyFree = "soy_free"
    case glutenFree = "gluten_free"
    case fishFree = "fish_free"
    case dairyFree = "dairy_free"
    case eggFree = "egg_free"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .vegetarian: "Vegetarian"
        case .vegan: "Vegan"
        case .pescatarian: "Pescatarian"
        case .halal: "Halal"
        case .kosher: "Kosher"
        case .nutFree: "Tree Nut Free"
        case .peanutFree: "Peanut Free"
        case .shellfishFree: "Shellfish Free"
        case .soyFree: "Soy Free"
        case .glutenFree: "Gluten Free"
        case .fishFree: "Fish Free"
        case .dairyFree: "Dairy Free"
        case .eggFree: "Egg Free"
        }
    }

    var group: DietaryGroup {
        switch self {
        case .vegetarian, .vegan, .pescatarian, .halal, .kosher: .diet
        case .nutFree, .peanutFree, .shellfishFree, .soyFree, .glutenFree, .fishFree, .dairyFree, .eggFree: .allergy
        }
    }

    var description: String {
        switch self {
        case .vegetarian: "Excludes meat and fish"
        case .vegan: "Excludes all animal products"
        case .pescatarian: "Excludes land meats"
        case .halal: "Excludes pork products"
        case .kosher: "Excludes pork and shellfish"
        case .nutFree: "Excludes tree nuts and coconut"
        case .peanutFree: "Excludes peanuts and peanut oil"
        case .shellfishFree: "Excludes crustaceans and mollusks"
        case .soyFree: "Excludes soy products"
        case .glutenFree: "Excludes wheat, barley, rye, oats"
        case .fishFree: "Excludes fish"
        case .dairyFree: "Excludes milk, cheese, yogurt, butter"
        case .eggFree: "Excludes all egg products"
        }
    }
}

enum DietaryGroup: String {
    case diet, allergy
}

struct DietaryPreferences: Codable {
    var active: Set<DietaryPreference> = []

    func isActive(_ pref: DietaryPreference) -> Bool {
        active.contains(pref)
    }

    mutating func toggle(_ pref: DietaryPreference) {
        if active.contains(pref) {
            active.remove(pref)
        } else {
            active.insert(pref)
        }
    }
}

private let meatTypes: Set<ItemType> = [.beef, .pork, .poultry, .fishSeafood, .lamb]
private let landMeatTypes: Set<ItemType> = [.beef, .pork, .poultry, .lamb]
private let butterNames: Set<String> = ["Butter (Salted)", "Butter (Unsalted)"]
private let coconutNames: Set<String> = ["Coconut", "Coconut Oil", "Coconut Cream", "Walnut Oil"]
private let glutenNames: Set<String> = ["Barley", "Rye", "Oats", "Oat Bran", "Spelt", "Bulgur"]

func isExcluded(_ item: FoodItem, by pref: DietaryPreference) -> Bool {
    switch pref {
    case .vegetarian:
        meatTypes.contains(item.type) || item.name == "Lard"
    case .vegan:
        meatTypes.contains(item.type) || item.type == .dairy || item.type == .egg || item.name == "Lard" || butterNames.contains(item.name)
    case .pescatarian:
        landMeatTypes.contains(item.type) || item.name == "Lard"
    case .halal:
        item.type == .pork || item.name == "Lard"
    case .kosher:
        item.type == .pork || item.category == .crustacean || item.category == .mollusk || item.name == "Lard"
    case .nutFree:
        item.category == .treeNut || coconutNames.contains(item.name)
    case .peanutFree:
        item.category == .legumeNut || item.name == "Peanut Oil"
    case .shellfishFree:
        item.category == .crustacean || item.category == .mollusk
    case .soyFree:
        item.category == .soy || item.name == "Soybean Oil"
    case .glutenFree:
        item.category == .wheat || glutenNames.contains(item.name)
    case .fishFree:
        item.category == .fish
    case .dairyFree:
        item.type == .dairy || butterNames.contains(item.name)
    case .eggFree:
        item.type == .egg
    }
}

func isItemExcluded(_ item: FoodItem, preferences: DietaryPreferences) -> Bool {
    for pref in preferences.active {
        if isExcluded(item, by: pref) { return true }
    }
    return false
}

func countExcludedByRule(_ foods: [FoodItem], preference: DietaryPreference) -> Int {
    foods.filter { isExcluded($0, by: preference) }.count
}
