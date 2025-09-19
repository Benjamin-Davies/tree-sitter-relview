import XCTest
import SwiftTreeSitter
import TreeSitterRelview

final class TreeSitterRelviewTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_relview())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading RelView grammar")
    }
}
