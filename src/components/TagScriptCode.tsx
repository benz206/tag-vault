import {
  tokenizeTagScript,
  type TagScriptTokenKind
} from '@tag-vault/tagscript';

const TOKEN_CLASSES: Record<TagScriptTokenKind, string> = {
  text: '',
  brace: 'text-ctp-red',
  punct: 'text-ctp-blue',
  block: 'text-ctp-green',
  control: 'text-ctp-yellow',
  param: 'text-ctp-mauve',
  compare: 'text-ctp-pink',
  math: 'text-ctp-maroon',
  separator: 'text-ctp-peach',
  literal: 'text-ctp-sky'
};

export default function TagScriptCode({ source }: { source: string }) {
  return (
    <code>
      {tokenizeTagScript(source).map((token, i) =>
        token.kind === 'text' ? (
          token.text
        ) : (
          <span key={i} className={TOKEN_CLASSES[token.kind]}>
            {token.text}
          </span>
        )
      )}
    </code>
  );
}
