package tree_sitter_sop_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-sop"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_sop.Language())
	if language == nil {
		t.Errorf("Error loading Sop grammar")
	}
}
