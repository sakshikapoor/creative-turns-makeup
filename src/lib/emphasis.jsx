import { Fragment } from 'react';

// Content files mark emphasis with *asterisks* so a non-technical editor can
// italicise a word without touching JSX. Renders *word* as <em>word</em>.
export default function emphasis(text) {
  return text.split(/\*([^*]+)\*/g).map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}
