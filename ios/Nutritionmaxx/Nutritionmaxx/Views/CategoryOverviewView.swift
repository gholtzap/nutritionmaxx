import SwiftUI
import Charts

struct CategoryOverviewView: View {
    @Environment(AppViewModel.self) private var vm
    @State private var selectedNutrient: NutrientKey = .caloriesKcal
    @State private var selectedType: ItemType?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    typeFilter
                    nutrientPicker
                    chartSection
                    categoryGrid
                }
                .padding()
            }
            .navigationTitle("Categories")
        }
    }

    private var typeFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(label: "All", isSelected: selectedType == nil) {
                    selectedType = nil
                }
                ForEach(ItemType.allCases) { type in
                    FilterChip(label: type.displayName, isSelected: selectedType == type) {
                        selectedType = type
                    }
                }
            }
        }
    }

    private var nutrientPicker: some View {
        Menu {
            ForEach(nutrientMetaList) { meta in
                Button {
                    selectedNutrient = meta.key
                } label: {
                    HStack {
                        Text(meta.label)
                        if selectedNutrient == meta.key { Image(systemName: "checkmark") }
                    }
                }
            }
        } label: {
            HStack {
                Text(nutrientMetaMap[selectedNutrient]?.label ?? "Select Nutrient")
                    .font(.subheadline.weight(.medium))
                Image(systemName: "chevron.up.chevron.down")
                    .font(.caption)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(.fill, in: Capsule())
        }
    }

    private func unwrap(_ value: Double??) -> Double? {
        guard let outer = value else { return nil }
        return outer
    }

    @ViewBuilder
    private var chartSection: some View {
        let categories = selectedType.map { ItemCategory.categories(for: $0) }
        let averages = computeCategoryAverages(foods: vm.filteredFoods, nutrientKeys: [selectedNutrient], categories: categories)
            .filter { unwrap($0.averages[selectedNutrient]) != nil }
            .sorted { (unwrap($0.averages[selectedNutrient]) ?? 0) > (unwrap($1.averages[selectedNutrient]) ?? 0) }

        if !averages.isEmpty {
            let meta = nutrientMetaMap[selectedNutrient]

            Chart(averages) { avg in
                BarMark(
                    x: .value("Value", unwrap(avg.averages[selectedNutrient]) ?? 0),
                    y: .value("Category", avg.category.rawValue)
                )
                .foregroundStyle(.blue.gradient)
                .annotation(position: .trailing) {
                    Text(meta?.formatWithUnit(unwrap(avg.averages[selectedNutrient])) ?? "--")
                        .font(.caption2.monospacedDigit())
                        .foregroundStyle(.secondary)
                }
            }
            .chartYAxis {
                AxisMarks { _ in
                    AxisValueLabel()
                        .font(.caption2)
                }
            }
            .frame(height: CGFloat(max(200, averages.count * 32)))
        }
    }

    private var categoryGrid: some View {
        let allCats = selectedType.map { ItemCategory.categories(for: $0) }
        let averages = computeCategoryAverages(foods: vm.filteredFoods, nutrientKeys: allNutrientKeys, categories: allCats)

        return LazyVGrid(columns: [GridItem(.adaptive(minimum: 160))], spacing: 12) {
            ForEach(averages) { avg in
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(avg.category.rawValue)
                            .font(.subheadline.weight(.medium))
                        Spacer()
                        Text("\(avg.count) items")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    if let cals = unwrap(avg.averages[.caloriesKcal]) {
                        Text("\(Int(cals)) kcal avg")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    if let protein = unwrap(avg.averages[.proteinG]) {
                        HStack {
                            Text("Protein")
                                .font(.caption2)
                            Spacer()
                            Text(String(format: "%.1fg", protein))
                                .font(.caption2.monospacedDigit())
                        }
                        .foregroundStyle(.secondary)
                    }
                }
                .padding(12)
                .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 10))
            }
        }
    }
}

private struct FilterChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.accentColor : Color(.systemGray5), in: Capsule())
                .foregroundStyle(isSelected ? .white : .primary)
        }
    }
}
