import SwiftUI

@main
struct NutritionmaxxApp: App {
    @State private var viewModel = AppViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(viewModel)
                .onAppear {
                    viewModel.loadPreferences()
                    viewModel.loadFoods()
                }
        }
    }
}
