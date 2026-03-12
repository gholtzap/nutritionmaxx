import SwiftUI

struct FixMyDietView: View {
    @Environment(AppViewModel.self) private var vm
    @State private var step = 0
    @State private var answers = WizardAnswers()
    @State private var results: [ScoredFood] = []
    @State private var showResults = false

    private let totalSteps = 8

    var body: some View {
        NavigationStack {
            VStack {
                if showResults {
                    resultsView
                } else {
                    wizardView
                }
            }
            .navigationTitle("Fix My Diet")
            .toolbar {
                if showResults {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Start Over") {
                            step = 0
                            answers = WizardAnswers()
                            results = []
                            showResults = false
                        }
                    }
                }
            }
        }
    }

    private var wizardView: some View {
        VStack(spacing: 24) {
            ProgressView(value: Double(step + 1), total: Double(totalSteps))
                .padding(.horizontal)

            Text("Step \(step + 1) of \(totalSteps)")
                .font(.caption)
                .foregroundStyle(.secondary)

            Spacer()

            Group {
                switch step {
                case 0: sexStep
                case 1: ageStep
                case 2: dietStep
                case 3: healthFocusStep
                case 4: pregnancyStep
                case 5: lifestyleStep
                case 6: symptomStep
                case 7: familyHistoryStep
                default: EmptyView()
                }
            }
            .padding(.horizontal)

            Spacer()

            HStack {
                if step > 0 {
                    Button("Back") {
                        withAnimation { step -= 1 }
                    }
                    .buttonStyle(.bordered)
                }
                Spacer()
                Button(step == totalSteps - 1 ? "Get Results" : "Next") {
                    if step == totalSteps - 1 {
                        computeResults()
                    } else {
                        withAnimation { step += 1 }
                    }
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
        }
    }

    private var sexStep: some View {
        VStack(spacing: 16) {
            Text("Biological Sex")
                .font(.title2.weight(.bold))
            Text("This affects recommended daily intake values")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Picker("Sex", selection: $answers.sex) {
                ForEach(BiologicalSex.allCases) { sex in
                    Text(sex.label).tag(sex)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    private var ageStep: some View {
        VStack(spacing: 16) {
            Text("Age Range")
                .font(.title2.weight(.bold))
            Picker("Age", selection: $answers.ageRange) {
                ForEach(WizardAgeRange.allCases) { range in
                    Text(range.label).tag(range)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    private var dietStep: some View {
        VStack(spacing: 16) {
            Text("Diet Pattern")
                .font(.title2.weight(.bold))
            ForEach(DietPattern.allCases) { pattern in
                Button {
                    answers.dietPattern = pattern
                } label: {
                    HStack {
                        Text(pattern.label)
                            .font(.body)
                        Spacer()
                        if answers.dietPattern == pattern {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(.blue)
                        }
                    }
                    .padding()
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var healthFocusStep: some View {
        VStack(spacing: 16) {
            Text("Health Focus")
                .font(.title2.weight(.bold))
            Text("Select any areas you want to prioritize")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ForEach(HealthFocus.allCases) { focus in
                MultiSelectRow(label: focus.label, isSelected: answers.healthFocus.contains(focus)) {
                    if answers.healthFocus.contains(focus) {
                        answers.healthFocus.remove(focus)
                    } else {
                        answers.healthFocus.insert(focus)
                    }
                }
            }
        }
    }

    private var pregnancyStep: some View {
        VStack(spacing: 16) {
            Text("Pregnancy / Breastfeeding")
                .font(.title2.weight(.bold))

            Button {
                answers.pregnancyStatus = nil
            } label: {
                HStack {
                    Text("Not applicable")
                    Spacer()
                    if answers.pregnancyStatus == nil {
                        Image(systemName: "checkmark.circle.fill").foregroundStyle(.blue)
                    }
                }
                .padding()
                .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 10))
            }
            .buttonStyle(.plain)

            ForEach(PregnancyStatus.allCases) { status in
                Button {
                    answers.pregnancyStatus = status
                } label: {
                    HStack {
                        Text(status.label)
                        Spacer()
                        if answers.pregnancyStatus == status {
                            Image(systemName: "checkmark.circle.fill").foregroundStyle(.blue)
                        }
                    }
                    .padding()
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var lifestyleStep: some View {
        VStack(spacing: 16) {
            Text("Lifestyle Factors")
                .font(.title2.weight(.bold))
            Text("These affect nutrient absorption and needs")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ForEach(LifestyleFactor.allCases) { factor in
                MultiSelectRow(label: factor.label, isSelected: answers.lifestyleFactors.contains(factor)) {
                    if answers.lifestyleFactors.contains(factor) {
                        answers.lifestyleFactors.remove(factor)
                    } else {
                        answers.lifestyleFactors.insert(factor)
                    }
                }
            }
        }
    }

    private var symptomStep: some View {
        VStack(spacing: 16) {
            Text("Current Symptoms")
                .font(.title2.weight(.bold))
            Text("Select any you experience regularly")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ForEach(Symptom.allCases) { symptom in
                MultiSelectRow(label: symptom.label, isSelected: answers.symptoms.contains(symptom)) {
                    if answers.symptoms.contains(symptom) {
                        answers.symptoms.remove(symptom)
                    } else {
                        answers.symptoms.insert(symptom)
                    }
                }
            }
        }
    }

    private var familyHistoryStep: some View {
        VStack(spacing: 16) {
            Text("Family History")
                .font(.title2.weight(.bold))
            Text("Select conditions that run in your family")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ForEach(FamilyCondition.allCases) { condition in
                MultiSelectRow(label: condition.label, isSelected: answers.familyHistory.contains(condition)) {
                    if answers.familyHistory.contains(condition) {
                        answers.familyHistory.remove(condition)
                    } else {
                        answers.familyHistory.insert(condition)
                    }
                }
            }
        }
    }

    private func computeResults() {
        let profile = buildDeficiencyProfile(answers)
        let allowedFoods = vm.foods.filter { !isItemExcluded($0, preferences: vm.dietaryPreferences) && !vm.blockedFoods.contains($0.name) }
        results = scoreFoodsForDeficiencies(allowedFoods, profile)
        withAnimation { showResults = true }
    }

    private var resultsView: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Your Top Recommendations")
                    .font(.title2.weight(.bold))
                    .padding(.horizontal)

                let deficiencies = getTopDeficiencies(buildDeficiencyProfile(answers), count: 5)
                if !deficiencies.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Key nutrients for your profile:")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        ForEach(deficiencies, id: \.key) { d in
                            HStack {
                                Text(d.label)
                                    .font(.subheadline)
                                Spacer()
                                NutrientBarView(percent: d.weight * 100)
                                    .frame(width: 80)
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                ForEach(Array(results.enumerated()), id: \.element.id) { index, scored in
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("#\(index + 1)")
                                .font(.title3.weight(.bold))
                                .foregroundStyle(.secondary)
                            Text(scored.food.name)
                                .font(.title3.weight(.bold))
                            Spacer()
                            Text(scored.food.type.displayName)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }

                        if let servingLabel = scored.food.servingLabel {
                            Text("Serving: \(servingLabel)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }

                        ForEach(scored.topNutrients, id: \.key) { nutrient in
                            HStack {
                                Text(nutrient.label)
                                    .font(.subheadline)
                                Spacer()
                                Text("\(nutrient.percentDV)% DV")
                                    .font(.subheadline.monospacedDigit())
                                    .foregroundStyle(.secondary)
                                NutrientBarView(percent: Double(nutrient.percentDV))
                                    .frame(width: 60)
                            }
                        }

                        HStack {
                            Button("Add to Meal Plan") {
                                vm.addPlanEntry(scored.food.name)
                            }
                            .buttonStyle(.bordered)

                            Button("Add to Compare") {
                                vm.toggleComparison(scored.food)
                            }
                            .buttonStyle(.bordered)
                        }
                    }
                    .padding()
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal)
                }

                if answers.dietPattern == .vegan {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("B12 Note")
                            .font(.subheadline.weight(.bold))
                        Text("Vitamin B12 is not found in plant foods. Consider a B12 supplement or fortified foods.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                    .background(.orange.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
    }
}

private struct MultiSelectRow: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Text(label)
                    .font(.body)
                Spacer()
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(isSelected ? .blue : .secondary)
            }
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }
}
