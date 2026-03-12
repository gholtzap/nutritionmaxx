import SwiftUI

struct ExplorerView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        @Bindable var vm = vm

        NavigationStack {
            List {
                ForEach(vm.filteredFoods, id: \.name) { food in
                    NavigationLink(value: food) {
                        FoodRowView(food: food)
                    }
                    .swipeActions(edge: .trailing) {
                        Button {
                            vm.toggleComparison(food)
                        } label: {
                            Label(
                                vm.comparisonFoods.contains(food) ? "Remove" : "Compare",
                                systemImage: vm.comparisonFoods.contains(food) ? "minus.circle" : "plus.circle"
                            )
                        }
                        .tint(.blue)

                        Button {
                            vm.addPlanEntry(food.name)
                        } label: {
                            Label("Add to Plan", systemImage: "calendar.badge.plus")
                        }
                        .tint(.green)
                    }
                }
            }
            .navigationTitle("Nutrition Explorer")
            .navigationDestination(for: FoodItem.self) { food in
                FoodDetailView(food: food)
            }
            .searchable(text: $vm.searchQuery, prompt: "Search foods...")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    TypeFilterMenu()
                }
                ToolbarItem(placement: .topBarTrailing) {
                    SortMenu()
                }
            }
        }
    }
}

private struct FoodRowView: View {
    @Environment(AppViewModel.self) private var vm
    let food: FoodItem

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(food.name)
                    .font(.body.weight(.medium))
                HStack(spacing: 8) {
                    Text(food.type.displayName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(food.category.rawValue)
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let score = vm.score(for: food) {
                    Text(String(format: "%.1f", score))
                        .font(.subheadline.monospacedDigit().weight(.semibold))
                        .foregroundStyle(scoreColor(score))
                }
                if let cals = food.calories {
                    Text("\(Int(cals)) kcal")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            if vm.comparisonFoods.contains(food) {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(.blue)
                    .font(.caption)
            }
        }
        .padding(.vertical, 2)
    }
}

private struct TypeFilterMenu: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        Menu {
            Button("All Types") {
                vm.selectedType = nil
                vm.selectedCategories = []
            }

            Divider()

            ForEach(ItemType.allCases) { type in
                Button {
                    vm.selectedType = type
                    vm.selectedCategories = []
                } label: {
                    HStack {
                        Text(type.displayName)
                        if vm.selectedType == type {
                            Image(systemName: "checkmark")
                        }
                    }
                }
            }

            if let selectedType = vm.selectedType {
                Divider()
                let cats = ItemCategory.categories(for: selectedType)
                ForEach(cats) { cat in
                    Button {
                        if vm.selectedCategories.contains(cat) {
                            vm.selectedCategories.remove(cat)
                        } else {
                            vm.selectedCategories.insert(cat)
                        }
                    } label: {
                        HStack {
                            Text(cat.rawValue)
                            if vm.selectedCategories.contains(cat) {
                                Image(systemName: "checkmark")
                            }
                        }
                    }
                }
            }
        } label: {
            Label("Filter", systemImage: vm.selectedType != nil ? "line.3.horizontal.decrease.circle.fill" : "line.3.horizontal.decrease.circle")
        }
    }
}

private struct SortMenu: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        Menu {
            Button {
                vm.sort = SortConfig(key: "name", direction: .ascending)
            } label: {
                HStack {
                    Text("Name")
                    if vm.sort.key == "name" { Image(systemName: "checkmark") }
                }
            }

            Button {
                vm.sort = SortConfig(key: "score", direction: .descending)
            } label: {
                HStack {
                    Text("Score")
                    if vm.sort.key == "score" { Image(systemName: "checkmark") }
                }
            }

            Divider()

            ForEach(nutrientMetaList) { meta in
                Button {
                    vm.sort = SortConfig(key: meta.key.rawValue, direction: .descending)
                } label: {
                    HStack {
                        Text(meta.label)
                        if vm.sort.key == meta.key.rawValue { Image(systemName: "checkmark") }
                    }
                }
            }
        } label: {
            Label("Sort", systemImage: "arrow.up.arrow.down")
        }
    }
}

func scoreColor(_ score: Double) -> Color {
    if score >= 15 { return .green }
    if score >= 8 { return .blue }
    if score >= 4 { return .orange }
    return .red
}
