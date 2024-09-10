/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// grammar.js
module.exports = grammar({
  name: 'sop',

  word: ($) => $.identifier,

  rules: {
    parser: ($) => repeat(choice($.block, $.comment)),

    block: ($) =>
      seq(
        field('name', $.identifier),
        '{',
        repeat(
          choice(
            $.block,
            $.function,
            $.property,
            $.if_statement,
            $.for_statement,
            $.comment,
          ),
        ),
        '}',
      ),

    function: ($) =>
      seq(
        field('name', $.identifier),
        '=>',
        field(
          'argument',
          choice(
            $.array,
            seq('{', repeat(choice($.key_value_pair, $.parameter)), '}'),
          ),
        ),
      ),

    key_value_pair: ($) =>
      seq(
        field('key', $.string),
        '=>',
        field('value', choice($.array, $.string)),
      ),

    array: ($) => seq('[', repeat(seq($.string, optional(','))), ']'),

    statement: ($) => prec.right(seq('{', repeat($.block), '}')),

    if_statement: ($) =>
      prec.right(
        seq(
          'if',
          field('condition', $.expression),
          field('consequence', $.statement),
          optional(field('alternative', $.else_clause)),
        ),
      ),

    else_clause: ($) => seq('else', choice($.if_statement, $.statement)),

    expression: ($) =>
      seq(
        field('negation', optional('!')),
        '[',
        $.identifier,
        ']',
        optional(seq($.operator, $.string)),
        optional(seq(choice('and', 'or'), $.expression)),
      ),

    operator: () => choice('==', '!=', '<', '>', '<=', '>=', '=~', '!~'),

    for_statement: ($) =>
      seq(
        'for',
        optional(seq($.identifier, ',')),
        $.identifier,
        optional('in'),
        choice($.identifier, seq($.identifier, 'map')),
        $.statement,
      ),

    property: ($) =>
      seq(
        field('name', $.identifier),
        '=>',
        field('value', choice($.string, $.identifier)),
      ),

    parameter: ($) =>
      seq(
        field('name', $.identifier),
        optional(seq('=>', choice($.string, $.function))),
      ),

    comment: (_) => token(seq('#', /.*/)),

    string: ($) =>
      choice(
        seq(
          '"',
          repeat(choice(/[^"\\]/, $.escaped_char, $.interpolation)),
          '"',
        ),
      ),

    escaped_char: () =>
      token(
        seq(
          '\\',
          choice(
            /[bfnrt"'\\]/, // Single-character escapes
            /u[0-9a-fA-F]{4}/, // Unicode escapes
            /x[0-9a-fA-F]{2}/, // Hexadecimal escapes
          ),
        ),
      ),

    interpolation: ($) =>
      seq(
        '%{',
        $.identifier,
        optional(seq(':', $.identifier)),
        optional(seq(':', $.identifier)),
        '}',
      ),

    identifier: (_) => /[a-zA-Z0-9_.]+/,
  },
});
