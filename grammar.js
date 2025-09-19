/**
 * @file RelView program language
 * @author Benjamin Davies <bentendavies@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'relview',

  extras: ($) => [$._whitespace, $.comment],

  precedences: ($) => [[$.transpose, $.complement]],

  rules: {
    source_file: ($) => repeat($.definition),

    _whitespace: ($) => /\s+/,
    comment: ($) => /\{[^\}]*\}/,
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_-]*/,

    definition: ($) =>
      seq(
        $.identifier,
        $.parameter_list,
        choice($.program_body, $.function_body),
        '.'
      ),
    program_body: ($) =>
      seq(
        optional($.decl_list),
        'BEG',
        repeat1($._statement),
        $.return_statement,
        'END'
      ),
    function_body: ($) => seq('=', $._expression),

    parameter_list: ($) =>
      seq(
        '(',
        optional(seq($.identifier, repeat(seq(',', $.identifier)))),
        ')'
      ),
    decl_list: ($) => seq('DECL', $.identifier, repeat(seq(',', $.identifier))),

    _statement: ($) =>
      choice($.assignment_statement, $.if_statement, $.while_loop),

    assignment_statement: ($) => seq($.identifier, '=', $._expression),

    if_statement: ($) =>
      seq('IF', $._expression, $.then_clause, optional($.else_clause), 'FI'),
    then_clause: ($) => seq('THEN', repeat1($._statement)),
    else_clause: ($) => seq('ELSE', repeat1($._statement)),

    while_loop: ($) => seq('WHILE', $._expression, $.while_body),
    while_body: ($) => seq('DO', repeat1($._statement), 'OD'),

    return_statement: ($) => seq('RETURN', $._expression),

    _expression: ($) => choice($._term, $.binary_expression),
    _term: ($) =>
      choice(
        $.identifier,
        $.transpose,
        $.complement,
        $.call,
        $.parenthesized_expression
      ),
    parenthesized_expression: ($) => seq('(', $._expression, ')'),

    call: ($) => seq($.identifier, $.argument_list),
    argument_list: ($) =>
      seq(
        '(',
        optional(seq($._expression, repeat(seq(',', $._expression)))),
        ')'
      ),

    complement: ($) => seq('-', $._term),
    transpose: ($) => seq($._term, '^'),

    binary_expression: ($) =>
      prec.left(seq($._term, $._binary_operator, $._expression)),
    _binary_operator: ($) => choice('|', '&', '+', '*', '/', '\\'),
  },
});
