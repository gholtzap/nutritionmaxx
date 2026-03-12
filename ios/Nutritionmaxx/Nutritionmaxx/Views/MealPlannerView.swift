import SwiftUI
import Charts

struct MealPlannerView: View {
    @Environment(AppViewModel.self) private var vm
    @State private var showFoodPicker = false

    var body: some View {
        NavigationStack {
            List {
                if !vm.planEntries.isEmpty {
                    nutrientCoverageSection
                    planEntriesSection
                    interactionsSection
                } else {
                    ContentUnavailableView(
                        "No Meal Plan",
                        systemImage: "calendar",
                        description: Text("Add foods manually or use Auto-Fill to generate a balanced meal plan.")
                    )
                }
            }
            .navigationTitle("Meal Plan")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Auto-Fill") {
                        vm.autoFillPlan()
                        vm.savePreferences()
                    }
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button {
                        showFoodPicker = true
                    } label: {
                        Image(systemName: "plus")
                    }
                    if !vm.planEntries.isEmpty {
                        Button("Clear", role: .destructive) {
                            vm.planEntries = []
                            vm.lockedPlanEntries = []
                            vm.savePreferences()
                        }
                    }
                }
            }
            .sheet(isPresented: $showFoodPicker) {
                FoodPickerSheet()
            }
        }
    }

    @ViewBuilder
    private var nutrientCoverageSection: some View {
        let rows = vm.planNutrientRows()
        Section("Nutrient Coverage (Daily)") {
            ForEach(rows) { row in
                if !row.insufficientData {
                    HStack {
                        Text(row.label)
                            .font(.subheadline)
                            .frame(width: 90, alignment: .leading)
                        NutrientBarView(percent: row.percentDV)
                        Text(String(format: "%.0f%%", row.percentDV))
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(row.percentDV >= 100 ? .green : .primary)
                            .frame(width: 44, alignment: .trailing)
                    }
                }
            }
        }
    }

    private var planEntriesSection: some View {
        Section("Foods (\(vm.planEntries.count))") {
            ForEach(vm.planEntries) { entry in
                HStack {
                    Button {
                        vm.togglePlanEntryLock(entry.name)
                    } label: {
                        Image(systemName: vm.lockedPlanEntries.contains(entry.name) ? "lock.fill" : "lock.open")
                            .font(.caption)
                            .foregroundStyle(vm.lockedPlanEntries.contains(entry.name) ? .orange : .secondary)
                    }
                    .buttonStyle(.plain)

                    VStack(alignment: .leading) {
                        Text(entry.name)
                            .font(.subheadline.weight(.medium))
                        if let food = vm.foods.first(where: { $0.name == entry.name }) {
                            Text("\(food.type.displayName) - \(food.category.rawValue)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }

                    Spacer()

                    Stepper(value: Binding(
                        get: { entry.servingsPerWeek },
                        set: { newVal in
                            if let idx = vm.planEntries.firstIndex(where: { $0.name == entry.name }) {
                                vm.planEntries[idx].servingsPerWeek = max(1, newVal)
                            }
                        }
                    ), in: 1...21) {
                        Text("\(entry.servingsPerWeek)/wk")
                            .font(.caption.monospacedDigit())
                    }
                }
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        vm.removePlanEntry(entry.name)
                    } label: {
                        Label("Remove", systemImage: "trash")
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var interactionsSection: some View {
        let rows = vm.planNutrientRows()
        let insights = analyzeInteractions(rows: rows)

        if !insights.isEmpty {
            Section("Nutrient Interactions") {
                ForEach(insights) { insight in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: interactionIcon(insight.type))
                            .foregroundStyle(interactionColor(insight.type))
                            .font(.subheadline)
                        Text(insight.message)
                            .font(.subheadline)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
    }

    private func interactionIcon(_ type: InteractionType) -> String {
        switch type {
        case .enhancer: "arrow.up.circle.fill"
        case .inhibitor: "arrow.down.circle.fill"
        case .requirement: "exclamationmark.circle.fill"
        }
    }

    private func interactionColor(_ type: InteractionType) -> Color {
        switch type {
        case .enhancer: .green
        case .inhibitor: .red
        case .requirement: .orange
        }
    }
}

private struct FoodPickerSheet: View {
    @Environment(AppViewModel.self) private var vm
    @Environment(\.dismiss) private var dismiss
    @State private var search = ""

    var body: some View {
        NavigationStack {
            List {
                let filtered = vm.filteredFoods.filter { food in
                    !vm.planEntries.contains(where: { $0.name == food.name }) &&
                    (search.isEmpty || food.name.lowercased().contains(search.lowercased()))
                }
                ForEach(filtered, id: \.name) { food in
                    Button {
                        vm.addPlanEntry(food.name)
                        vm.savePreferences()
                    } label: {
                        HStack {
                            Text(food.name)
                                .font(.subheadline)
                            Spacer()
                            Text(food.type.displayName)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Add Food")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $search, prompt: "Search foods...")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
