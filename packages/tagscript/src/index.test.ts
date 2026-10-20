import { describe, expect, test } from 'bun:test';
import { tokenizeTagScript } from './index';

describe('tokenizeTagScript', () => {
  test('plain text is a single text token', () => {
    expect(tokenizeTagScript('hello world')).toEqual([
      { kind: 'text', text: 'hello world' }
    ]);
  });

  test('assignment block', () => {
    expect(tokenizeTagScript('{=(prefix):!}')).toEqual([
      { kind: 'brace', text: '{' },
      { kind: 'block', text: '=' },
      { kind: 'punct', text: '(' },
      { kind: 'text', text: 'prefix' },
      { kind: 'punct', text: '):' },
      { kind: 'text', text: '!' },
      { kind: 'brace', text: '}' }
    ]);
  });

  test('control block with nested block, comparison and branches', () => {
    expect(tokenizeTagScript('{if({args}==hi):yes|no}')).toEqual([
      { kind: 'brace', text: '{' },
      { kind: 'control', text: 'if' },
      { kind: 'punct', text: '(' },
      { kind: 'brace', text: '{' },
      { kind: 'block', text: 'args' },
      { kind: 'brace', text: '}' },
      { kind: 'compare', text: '==' },
      { kind: 'text', text: 'hi' },
      { kind: 'punct', text: '):' },
      { kind: 'text', text: 'yes' },
      { kind: 'compare', text: '|' },
      { kind: 'text', text: 'no' },
      { kind: 'brace', text: '}' }
    ]);
  });

  test('math operators are only highlighted inside math blocks', () => {
    expect(tokenizeTagScript('{math:1+2}')).toContainEqual({
      kind: 'math',
      text: '+'
    });
    expect(tokenizeTagScript('{unknown:a+b}')).toContainEqual({
      kind: 'text',
      text: 'a+b'
    });
  });

  test('parameters are recognised inside parentheses', () => {
    expect(tokenizeTagScript('{user(name)}')).toContainEqual({
      kind: 'param',
      text: 'name'
    });
  });

  test('separators', () => {
    const kinds = tokenizeTagScript('{random:a~b,c}').map((t) => t.kind);
    expect(kinds.filter((k) => k === 'separator')).toHaveLength(2);
  });

  test('unclosed blocks do not throw', () => {
    expect(tokenizeTagScript('{=(x):a').at(-1)).toEqual({
      kind: 'text',
      text: 'a'
    });
  });

  test.each([
    '',
    'a+b {random:a~b,c}',
    '{if({args(1)}>=3):{embed:{"title":"x"}}|nope}',
    '}}{{(:)|',
    '{=(COMMENT):User Settings}\n{=(prefix):!}'
  ])('tokens join back into the source: %p', (source) => {
    expect(
      tokenizeTagScript(source)
        .map((t) => t.text)
        .join('')
    ).toBe(source);
  });
});
