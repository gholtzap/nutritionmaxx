import SwiftUI

struct SettingsView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        NavigationStack {
            List {
                displaySection
                profileSection
                personalizationSection
                dietarySection
                scoreSection
                dailyValuesSection
            }
            .navigationTitle("Settings")
        }
    }

    private var displaySection: some View {
        Section("Display") {
            Toggle("Show % Daily Value", isOn: Binding(
                get: { vm.showDailyValue },
                set: { vm.showDailyValue = $0 }
            ))
            Toggle("Show Per Serving", isOn: Binding(
                get: { vm.showPerServing },
                set: { vm.showPerServing = $0 }
            ))
        }
    }

    @ViewBuilder
    private var profileSection: some View {
        Section("Profile") {
            if let profile = vm.userProfile {
                HStack {
                    Text("Sex")
                    Spacer()
                    Text(profile.sex.label)
                        .foregroundStyle(.secondary)
                }
                HStack {
                    Text("Weight")
                    Spacer()
                    Text("\(Int(profile.weightKg)) kg")
                        .foregroundStyle(.secondary)
                }
                HStack {
                    Text("Height")
                    Spacer()
                    Text("\(Int(profile.heightCm)) cm")
                        .foregroundStyle(.secondary)
                }
                if let age = profile.age {
                    HStack {
                        Text("Age")
                        Spacer()
                        Text("\(age)")
                            .foregroundStyle(.secondary)
                    }
                }
                Button("Clear Profile", role: .destructive) {
                    vm.userProfile = nil
                    vm.savePreferences()
                }
            } else {
                NavigationLink("Set Up Profile") {
                    ProfileSetupView()
                }
            }
        }
    }

    private var personalizationSection: some View {
        Section("Personalization") {
            NavigationLink("Health Goals (\(vm.personalization.healthGoals.count))") {
                HealthGoalsView()
            }

            Picker("Activity Level", selection: Binding(
                get: { vm.personalization.activityLevel },
                set: {
                    vm.personalization.activityLevel = $0
                    vm.savePreferences()
                }
            )) {
                ForEach(ActivityLevel.allCases) { level in
                    Text(level.label).tag(level)
                }
            }

            Picker("Dietary Pattern", selection: Binding(
                get: { vm.personalization.dietaryPattern },
                set: {
                    vm.personalization.dietaryPattern = $0
                    vm.savePreferences()
                }
            )) {
                ForEach(DietaryPattern.allCases) { pattern in
                    Text(pattern.label).tag(pattern)
                }
            }

            if vm.userProfile?.sex == .female {
                Picker("Life Stage", selection: Binding(
                    get: { vm.personalization.lifeStage },
                    set: {
                        vm.personalization.lifeStage = $0
                        vm.savePreferences()
                    }
                )) {
                    ForEach(LifeStage.allCases) { stage in
                        Text(stage.label).tag(stage)
                    }
                }
            }
        }
    }

    private var dietarySection: some View {
        Section("Dietary Preferences") {
            NavigationLink {
                DietaryPreferencesView()
                    .navigationTitle("Dietary Preferences")
            } label: {
                HStack {
                    Text("Preferences & Allergies")
                    Spacer()
                    Text("\(vm.dietaryPreferences.active.count) active")
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private var scoreSection: some View {
        Section("Score Nutrients") {
            NavigationLink("Included Nutrients (\(vm.scoreNutrients.count))") {
                ScoreNutrientsView()
            }

            Stepper("Budget Tolerance: \(vm.budgetTolerance)", value: Binding(
                get: { vm.budgetTolerance },
                set: {
                    vm.budgetTolerance = $0
                    vm.savePreferences()
                }
            ), in: 1...10)
        }
    }

    @ViewBuilder
    private var dailyValuesSection: some View {
        Section("Custom Daily Values") {
            if vm.customDailyValues.isEmpty {
                Text("Using defaults (adjusted by profile if set)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(Array(vm.customDailyValues.sorted(by: { $0.key.rawValue < $1.key.rawValue })), id: \.key) { key, value in
                    HStack {
                        Text(nutrientMetaMap[key]?.label ?? key.rawValue)
                            .font(.subheadline)
                        Spacer()
                        Text(String(format: "%.1f %@", value, nutrientMetaMap[key]?.unit ?? ""))
                            .font(.subheadline.monospacedDigit())
                            .foregroundStyle(.secondary)
                        Button {
                            vm.customDailyValues.removeValue(forKey: key)
                            vm.savePreferences()
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.secondary)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }
}

private struct ProfileSetupView: View {
    @Environment(AppViewModel.self) private var vm
    @Environment(\.dismiss) private var dismiss
    @State private var sex: UserProfile.BiologicalSex = .male
    @State private var weightKg = 70.0
    @State private var heightCm = 170.0
    @State private var age = 30
    @State private var includeAge = true

    var body: some View {
        Form {
            Picker("Sex", selection: $sex) {
                ForEach(UserProfile.BiologicalSex.allCases) { s in
                    Text(s.label).tag(s)
                }
            }

            HStack {
                Text("Weight")
                Spacer()
                TextField("kg", value: $weightKg, format: .number)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                    .frame(width: 80)
                Text("kg")
                    .foregroundStyle(.secondary)
            }

            HStack {
                Text("Height")
                Spacer()
                TextField("cm", value: $heightCm, format: .number)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                    .frame(width: 80)
                Text("cm")
                    .foregroundStyle(.secondary)
            }

            Toggle("Include Age", isOn: $includeAge)
            if includeAge {
                Stepper("Age: \(age)", value: $age, in: 18...100)
            }

            Button("Save Profile") {
                vm.userProfile = UserProfile(
                    sex: sex,
                    weightKg: weightKg,
                    heightCm: heightCm,
                    age: includeAge ? age : nil
                )
                vm.savePreferences()
                dismiss()
            }
            .buttonStyle(.borderedProminent)
        }
        .navigationTitle("Profile Setup")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct HealthGoalsView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        List {
            ForEach(HealthGoal.allCases) { goal in
                Toggle(goal.label, isOn: Binding(
                    get: { vm.personalization.healthGoals.contains(goal) },
                    set: { isOn in
                        if isOn {
                            vm.personalization.healthGoals.append(goal)
                        } else {
                            vm.personalization.healthGoals.removeAll { $0 == goal }
                        }
                        vm.savePreferences()
                    }
                ))
            }
        }
        .navigationTitle("Health Goals")
    }
}

private struct ScoreNutrientsView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        List {
            Section {
                Button("Reset to Defaults") {
                    vm.scoreNutrients = defaultScoreNutrients
                    vm.savePreferences()
                }
            }

            Section("Macros") {
                ForEach(nutrientMetaList.filter { $0.group == .macro && $0.dailyValue != nil && !defaultPenaltyNutrients.contains($0.key) && !excludedFromScore.contains($0.key) }) { meta in
                    nutrientToggle(meta)
                }
            }

            Section("Vitamins") {
                ForEach(nutrientMetaList.filter { $0.group == .vitamin }) { meta in
                    nutrientToggle(meta)
                }
            }

            Section("Minerals") {
                ForEach(nutrientMetaList.filter { $0.group == .mineral && !defaultPenaltyNutrients.contains($0.key) }) { meta in
                    nutrientToggle(meta)
                }
            }
        }
        .navigationTitle("Score Nutrients")
    }

    private func nutrientToggle(_ meta: NutrientMeta) -> some View {
        Toggle(meta.label, isOn: Binding(
            get: { vm.scoreNutrients.contains(meta.key) },
            set: { isOn in
                if isOn {
                    vm.scoreNutrients.insert(meta.key)
                } else {
                    vm.scoreNutrients.remove(meta.key)
                }
                vm.savePreferences()
            }
        ))
    }
}
