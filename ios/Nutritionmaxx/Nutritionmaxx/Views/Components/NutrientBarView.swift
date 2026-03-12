import SwiftUI

struct NutrientBarView: View {
    let percent: Double
    var height: CGFloat = 6

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(.quaternary)
                Capsule()
                    .fill(barColor)
                    .frame(width: min(geo.size.width, geo.size.width * (percent / 100)))
            }
        }
        .frame(height: height)
    }

    private var barColor: Color {
        if percent >= 100 { return .green }
        if percent >= 50 { return .blue }
        if percent >= 20 { return .orange }
        return .red
    }
}

struct ScoreBadgeView: View {
    let score: Double

    var body: some View {
        Text(String(format: "%.1f", score))
            .font(.caption.weight(.bold).monospacedDigit())
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(scoreColor(score).opacity(0.15), in: Capsule())
            .foregroundStyle(scoreColor(score))
    }
}
