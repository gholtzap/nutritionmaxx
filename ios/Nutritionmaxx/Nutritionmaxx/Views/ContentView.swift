import SwiftUI

struct ContentView: View {
    @Environment(AppViewModel.self) private var vm

    var body: some View {
        TabView {
            ExplorerView()
                .tabItem { Label("Explorer", systemImage: "list.bullet") }

            ComparisonView()
                .tabItem { Label("Compare", systemImage: "arrow.left.arrow.right") }

            CategoryOverviewView()
                .tabItem { Label("Categories", systemImage: "chart.bar.fill") }

            MealPlannerView()
                .tabItem { Label("Meal Plan", systemImage: "calendar") }

            FixMyDietView()
                .tabItem { Label("Fix My Diet", systemImage: "wand.and.stars") }

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
        }
        .overlay {
            if vm.loading {
                ProgressView("Loading nutrition data...")
            }
            if let error = vm.error {
                ContentUnavailableView("Failed to Load", systemImage: "exclamationmark.triangle", description: Text(error))
            }
        }
    }
}
