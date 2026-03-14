import React from 'react';

type Props = { text: string };

function parseInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  const patterns: [RegExp, (m: RegExpExecArray) => JSX.Element][] = [
    [/\*\*([^*]+)\*\*/, m => <strong key={Math.random()}>{m[1]}</strong>],
    [/\*([^*]+)\*/, m => <em key={Math.random()}>{m[1]}</em>],
    [/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/, m => <a key={Math.random()} href={m[2]} target="_blank" rel="noopener noreferrer" className="underline text-accent">{m[1]}</a>],
  ];
  while (remaining.length) {
    let matched = false;
    for (const [re, factory] of patterns) {
      const m = re.exec(remaining);
      if (m && m.index !== undefined) {
        if (m.index > 0) parts.push(remaining.slice(0, m.index));
        parts.push(factory(m));
        remaining = remaining.slice(m.index + m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push(remaining);
      break;
    }
  }
  return parts;
}

export const MarkdownContent: React.FC<Props> = ({ text }) => {
  const lines = text.split(/\r?\n/);
  return (
    <div className="prose prose-slate max-w-none">
      {lines.map((line, i) => {
        if (/^###\s+/.test(line)) return <h3 key={i}>{parseInline(line.replace(/^###\s+/, ''))}</h3>;
        if (/^##\s+/.test(line)) return <h2 key={i}>{parseInline(line.replace(/^##\s+/, ''))}</h2>;
        if (/^#\s+/.test(line)) return <h1 key={i}>{parseInline(line.replace(/^#\s+/, ''))}</h1>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i}>{parseInline(line)}</p>;
      })}
    </div>
  );
};

export default MarkdownContent;
