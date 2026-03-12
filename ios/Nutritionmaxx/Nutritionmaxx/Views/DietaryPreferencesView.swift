import SwiftUI

struct DietaryPreferencesView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        List {
            Section("Diets") {
                ForEach(DietaryPreference.allCases.filter { $0.group == .diet }) { pref in
                    Toggle(isOn: Binding(
                        get: { vm.dietaryPreferences.isActive(pref) },
                        set: { _ in
                            vm.dietaryPreferences.toggle(pref)
                            vm.savePreferences()
                        }
                    )) {
                        VStack(alignment: .leading) {
                            Text(pref.label)
                                .font(.subheadline)
                            Text("\(pref.description) (\(countExcludedByRule(vm.foods, preference: pref)) excluded)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }

            Section("Allergies") {
                ForEach(DietaryPreference.allCases.filter { $0.group == .allergy }) { pref in
                    Toggle(isOn: Binding(
                        get: { vm.dietaryPreferences.isActive(pref) },
                        set: { _ in
                            vm.dietaryPreferences.toggle(pref)
                            vm.savePreferences()
                        }
                    )) {
                        VStack(alignment: .leading) {
                            Text(pref.label)
                                .font(.subheadline)
                            Text("\(pref.description) (\(countExcludedByRule(vm.foods, preference: pref)) excluded)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }

            Section("Blocked Foods") {
                if vm.blockedFoods.isEmpty {
                    Text("No foods blocked")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(Array(vm.blockedFoods).sorted(), id: \.self) { name in
                        HStack {
                            Text(name)
                                .font(.subheadline)
                            Spacer()
                            Button {
                                vm.blockedFoods.remove(name)
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

            if !vm.dietaryPreferences.active.isEmpty {
                Section {
                    Button("Clear All Preferences", role: .destructive) {
                        vm.dietaryPreferences = DietaryPreferences()
                        vm.savePreferences()
                    }
                }
            }
        }
    }
}
