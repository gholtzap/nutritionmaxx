import SwiftUI

struct ComparisonView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        NavigationStack {
            Group {
                if vm.comparisonFoods.isEmpty {
                    ContentUnavailableView(
                        "No Foods Selected",
                        systemImage: "arrow.left.arrow.right",
                        description: Text("Swipe right on foods in the Explorer tab to add them for comparison. You can compare up to 3 foods.")
                    )
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            selectedFoodsHeader
                            comparisonTable
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("Compare")
            .toolbar {
                if !vm.comparisonFoods.isEmpty {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Clear") {
                            vm.comparisonFoods = []
                        }
                    }
                }
            }
        }
    }

    private var selectedFoodsHeader: some View {
        HStack(spacing: 12) {
            ForEach(vm.comparisonFoods, id: \.name) { food in
                VStack(spacing: 4) {
                    Text(food.name)
                        .font(.subheadline.weight(.medium))
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                    if let score = vm.score(for: food) {
                        Text(String(format: "%.1f", score))
                            .font(.caption.monospacedDigit().weight(.bold))
                            .foregroundStyle(scoreColor(score))
                    }
                    Button(role: .destructive) {
                        vm.comparisonFoods.removeAll { $0.name == food.name }
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.caption)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding()
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
    }

    private var comparisonTable: some View {
        VStack(spacing: 0) {
            comparisonGroup("Macros", keys: macroKeys)
            comparisonGroup("Vitamins", keys: vitaminKeys)
            comparisonGroup("Minerals", keys: mineralKeys)
        }
    }

    private func comparisonGroup(_ title: String, keys: [NutrientKey]) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.headline)
                .padding(.vertical, 8)

            ForEach(keys) { key in
                if let meta = nutrientMetaMap[key] {
                    HStack {
                        Text(meta.label)
                            .font(.subheadline)
                            .frame(width: 90, alignment: .leading)

                        ForEach(vm.comparisonFoods, id: \.name) { food in
                            let value = vm.showPerServing
                                ? food[key].map { $0 * food.servingMultiplier }
                                : food[key]

                            VStack(alignment: .trailing, spacing: 2) {
                                Text(meta.formatWithUnit(value))
                                    .font(.caption.monospacedDigit())
                                if let v = value, let dv = meta.dailyValue, dv > 0 {
                                    NutrientBarView(percent: (v / dv) * 100)
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .trailing)
                        }
                    }
                    .padding(.vertical, 4)
                    Divider()
                }
            }
        }
    }
}
