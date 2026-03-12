import SwiftUI
import Charts

struct FoodDetailView: View {
    @Environment(AppViewModel.self) private var vm
    let food: FoodItem

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                headerSection
                macroChartSection
                nutrientListSection
                scoreBreakdownSection
                similarFoodsSection
            }
            .padding()
        }
        .navigationTitle(food.name)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button {
                        vm.toggleComparison(food)
                    } label: {
                        Label(
                            vm.comparisonFoods.contains(food) ? "Remove from Compare" : "Add to Compare",
                            systemImage: vm.comparisonFoods.contains(food) ? "minus.circle" : "plus.circle"
                        )
                    }
                    Button {
                        vm.addPlanEntry(food.name)
                    } label: {
                        Label("Add to Meal Plan", systemImage: "calendar.badge.plus")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
    }

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Label(food.type.displayName, systemImage: food.type.systemImage)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text(food.category.rawValue)
                    .font(.subheadline)
                    .foregroundStyle(.tertiary)
            }

            if let servingLabel = food.servingLabel {
                Text("Serving: \(servingLabel)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            if let score = vm.score(for: food) {
                HStack(spacing: 8) {
                    Text("Nutrient Density Score")
                        .font(.subheadline)
                    Text(String(format: "%.1f", score))
                        .font(.title2.weight(.bold).monospacedDigit())
                        .foregroundStyle(scoreColor(score))
                }
            }
        }
    }

    @ViewBuilder
    private var macroChartSection: some View {
        let macros: [(name: String, value: Double, color: Color)] = [
            ("Protein", food.protein ?? 0, .blue),
            ("Fat", food.fat ?? 0, .orange),
            ("Carbs", food.carbs ?? 0, .green),
            ("Fiber", food.fiber ?? 0, .brown),
        ].filter { $0.value > 0 }

        if !macros.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Macronutrients")
                    .font(.headline)

                Chart(macros, id: \.name) { macro in
                    SectorMark(
                        angle: .value(macro.name, macro.value),
                        innerRadius: .ratio(0.5)
                    )
                    .foregroundStyle(macro.color)
                }
                .frame(height: 200)
                .chartLegend(position: .bottom, alignment: .center)

                if let cals = food.calories {
                    Text("\(Int(cals)) kcal per 100g")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private var nutrientListSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            NutrientGroupSection(title: "Macros", keys: macroKeys, food: food, showDV: vm.showDailyValue, dvMap: vm.effectiveDailyValues, perServing: vm.showPerServing)
            NutrientGroupSection(title: "Vitamins", keys: vitaminKeys, food: food, showDV: vm.showDailyValue, dvMap: vm.effectiveDailyValues, perServing: vm.showPerServing)
            NutrientGroupSection(title: "Minerals", keys: mineralKeys, food: food, showDV: vm.showDailyValue, dvMap: vm.effectiveDailyValues, perServing: vm.showPerServing)
        }
    }

    @ViewBuilder
    private var scoreBreakdownSection: some View {
        if let breakdown = computeScoreBreakdown(
            item: food,
            selectedNutrients: vm.scoreNutrients,
            dvMap: vm.effectiveDailyValues,
            config: vm.scoreConfig,
            baseConfig: defaultScoreConfig
        ) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Score Breakdown")
                    .font(.headline)

                ForEach(breakdown.nutrients.prefix(10), id: \.key) { entry in
                    HStack {
                        Text(nutrientMetaMap[entry.key]?.label ?? entry.key.rawValue)
                            .font(.subheadline)
                        Spacer()
                        Text(String(format: "%.0f%% DV", entry.percentDV))
                            .font(.subheadline.monospacedDigit())
                            .foregroundStyle(.secondary)
                        Text(String(format: "%.0f%%", entry.sharePercent))
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(.tertiary)
                            .frame(width: 40, alignment: .trailing)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var similarFoodsSection: some View {
        let similar = findSimilarFoods(target: food, allFoods: vm.foods)
        if !similar.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Similar Foods")
                    .font(.headline)

                ForEach(similar) { item in
                    HStack {
                        Text(item.food.name)
                            .font(.subheadline)
                        Spacer()
                        Text(String(format: "%.0f%% match", item.similarity * 100))
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
    }
}

private struct NutrientGroupSection: View {
    let title: String
    let keys: [NutrientKey]
    let food: FoodItem
    let showDV: Bool
    let dvMap: EffectiveDailyValues
    let perServing: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.headline)
                .padding(.top, 8)

            ForEach(keys) { key in
                if let meta = nutrientMetaMap[key] {
                    let rawValue = food[key]
                    let displayValue = perServing ? rawValue.map { $0 * food.servingMultiplier } : rawValue

                    HStack {
                        Text(meta.label)
                            .font(.subheadline)
                        Spacer()
                        Text(meta.formatWithUnit(displayValue))
                            .font(.subheadline.monospacedDigit())
                            .foregroundStyle(displayValue != nil ? .primary : .tertiary)
                        if showDV, let value = displayValue, let dv = dvMap[key] ?? meta.dailyValue, dv > 0 {
                            let pct = (value / dv) * 100
                            Text(String(format: "%.0f%%", pct))
                                .font(.caption.monospacedDigit())
                                .foregroundStyle(dvColor(pct))
                                .frame(width: 44, alignment: .trailing)
                        } else {
                            Text("")
                                .frame(width: 44)
                        }
                    }
                }
            }
        }
    }

    private func dvColor(_ pct: Double) -> Color {
        if pct >= 100 { return .green }
        if pct >= 50 { return .blue }
        if pct >= 20 { return .orange }
        return .red
    }
}
