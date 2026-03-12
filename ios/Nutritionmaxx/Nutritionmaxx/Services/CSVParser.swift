import Foundation

enum CSVParserError: Error {
    case fileNotFound
    case invalidData
}

struct CSVParser {
    static func loadFoods() throws -> [FoodItem] {
        guard let url = Bundle.main.url(forResource: "nutrition", withExtension: "csv") else {
            throw CSVParserError.fileNotFound
        }
        let data = try Data(contentsOf: url)
        guard let content = String(data: data, encoding: .utf8) else {
            throw CSVParserError.invalidData
        }
        return parse(csv: content)
    }

    static func parse(csv: String) -> [FoodItem] {
        let lines = csv.components(separatedBy: .newlines)
        guard let headerLine = lines.first else { return [] }
        let headers = parseCSVLine(headerLine)
        let headerIndex = Dictionary(uniqueKeysWithValues: headers.enumerated().map { ($1, $0) })

        var foods: [FoodItem] = []

        for lineIndex in 1..<lines.count {
            let line = lines[lineIndex].trimmingCharacters(in: .whitespaces)
            if line.isEmpty { continue }

            let fields = parseCSVLine(line)
            guard let nameIdx = headerIndex["name"],
                  let typeIdx = headerIndex["type"],
                  let categoryIdx = headerIndex["category"],
                  nameIdx < fields.count,
                  typeIdx < fields.count,
                  categoryIdx < fields.count
            else { continue }

            let name = fields[nameIdx].trimmingCharacters(in: .whitespaces)
            let typeStr = fields[typeIdx].trimmingCharacters(in: .whitespaces)
            let categoryStr = fields[categoryIdx].trimmingCharacters(in: .whitespaces)

            guard !name.isEmpty,
                  let type = ItemType(rawValue: typeStr),
                  let category = ItemCategory(rawValue: categoryStr)
            else { continue }

            let fdcId = field(fields, headerIndex, "fdc_id") ?? ""
            let servingSizeG = numericField(fields, headerIndex, "serving_size_g")
            let servingLabel = field(fields, headerIndex, "serving_label")
            let costIndex = numericField(fields, headerIndex, "cost_index")

            var nutrients: [NutrientKey: Double] = [:]
            for key in NutrientKey.allCases {
                if let value = numericField(fields, headerIndex, key.rawValue) {
                    nutrients[key] = value
                }
            }

            foods.append(FoodItem(
                name: name,
                type: type,
                category: category,
                fdcId: fdcId,
                servingSizeG: servingSizeG,
                servingLabel: servingLabel,
                costIndex: costIndex,
                nutrients: nutrients
            ))
        }

        return foods
    }

    private static func field(_ fields: [String], _ index: [String: Int], _ key: String) -> String? {
        guard let idx = index[key], idx < fields.count else { return nil }
        let value = fields[idx].trimmingCharacters(in: .whitespaces)
        return value.isEmpty ? nil : value
    }

    private static func numericField(_ fields: [String], _ index: [String: Int], _ key: String) -> Double? {
        guard let str = field(fields, index, key) else { return nil }
        return Double(str)
    }

    private static func parseCSVLine(_ line: String) -> [String] {
        var fields: [String] = []
        var current = ""
        var inQuotes = false

        for char in line {
            if char == "\"" {
                inQuotes.toggle()
            } else if char == "," && !inQuotes {
                fields.append(current)
                current = ""
            } else {
                current.append(char)
            }
        }
        fields.append(current)
        return fields
    }
}
