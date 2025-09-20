package tree_sitter_relview_relation_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_relview_relation "github.com/benjamin-davies/tree-sitter-relview/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_relview_relation.Language())
	if language == nil {
		t.Errorf("Error loading RelView Relation grammar")
	}
}
