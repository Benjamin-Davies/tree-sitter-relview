import XCTest
import SwiftTreeSitter
import TreeSitterRelviewRelation

final class TreeSitterRelviewRelationTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_relview_relation())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading RelView Relation grammar")
    }
}
