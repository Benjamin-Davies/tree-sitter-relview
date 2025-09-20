/**
 * @file RelView relation language
 * @author Benjamin Davies <bentendavies@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'relview_relation',

  extras: ($) => [],

  rules: {
    source_file: ($) => seq($.header, repeat($.line)),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_-]*/,
    number: ($) => /\d+/,

    header: ($) => seq($.identifier, ' ', '(', $.domain, ')', '\n'),
    domain: ($) => seq($.number, ',', ' ', $.number),

    line: ($) => seq($.number, ' ', ':', ' ', $.number_list, '\n'),
    number_list: ($) => seq($.number, repeat(seq(',', ' ', $.number))),
  },
});
