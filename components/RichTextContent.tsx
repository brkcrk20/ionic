import type { CSSProperties } from "react";

function looksLikeHtml(value: string) {
  return /<([a-z][\w-]*)(\s|>)/i.test(value) || /&[a-z]+;/.test(value);
}

export default function RichTextContent({
  value,
  className,
  style,
  fallback = "",
}: {
  value?: string | null;
  className?: string;
  style?: CSSProperties;
  fallback?: string;
}) {
  const content = value?.trim() ?? "";
  if (!content) return fallback ? <span className={className} style={style}>{fallback}</span> : null;

  if (looksLikeHtml(content)) {
    return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <div className={className} style={style}>{content}</div>;
}
