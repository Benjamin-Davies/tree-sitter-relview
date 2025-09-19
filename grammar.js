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

  precedences: ($) => [
    [$.transpose, $.complement],
    [$.base_function, $.identifier],
  ],

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

    call: ($) => seq(choice($.base_function, $.identifier), $.argument_list),
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

    base_function: ($) =>
      choice(
        // Base functions for calculating constant relations and domains:
        'TRUE',
        'true',
        'FALSE',
        'false',
        'L',
        'O',
        'I',
        'Ln1',
        'On1',
        'L1n',
        'O1n',
        'dom',

        // Base functions for calculating residuals and symmetric quotients:
        'syq',

        // Base functions for calculating closures:
        'trans',
        'refl',
        'symm',

        // Various base functions concerning vectors and points without choice operations:
        'inj',
        'init',
        'next',
        'succ',

        // Base operations for choices:
        'point',
        'atom',

        // Base operations which generate random relations:
        'randomXY',
        'randomcfXY',
        'random',
        'randomperm',

        // Base functions for certain tests on relations
        'empty',
        'unival',
        'eq',
        'incl',
        'cardeq',
        'cardlt',
        'cardleq',
        'cardgt',
        'cardgeq',

        // Base functions concerning operations on powersets:
        'epsi',
        'cardrel',
        'cardfilter',

        // Base functions concerning relational product and sum domains:
        '1-st',
        '2-nd',
        'p-1',
        'p-2',
        'p-ord',
        'i-1',
        'i-2',
        's-ord',

        // Base functions concerning function domains:
        'part-f',
        'tot-f',

        // Base functions for minimal and maximal sets:
        'minsets',
        'minsets_upset',
        'maxsets',
        'maxsets_downset'
      ),
  },
});
