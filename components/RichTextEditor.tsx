"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { Bold, ChevronDown, Code2, Italic, Link2, List, ListOrdered, Minus, Paintbrush, Pilcrow, Redo2, Slash, Type, Underline, Undo2, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
  label?: string;
};

const FONT_FAMILIES = [
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
];

const FONT_SIZES = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
];

const COLORS = ["#111111", "#3A3A3A", "#B87332", "#7A4E1D", "#FFFFFF", "#D32F2F", "#1976D2", "#2E7D32"];

function isEditorEmpty(html: string) {
  return html.replace(/<p><br><\/p>/g, "").replace(/&nbsp;/g, " ").replace(/<br\s*\/?>(\s*)/g, "").trim() === "";
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function blockCommand(tag: string) {
  try {
    document.execCommand("formatBlock", false, tag);
  } catch {
    // ignore
  }
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 260, className, label }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState(value || "");
  const [wordCount, setWordCount] = useState(0);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [fontSize, setFontSize] = useState(FONT_SIZES[2].value);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (value !== html) {
      setHtml(value || "");
      if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
    const plain = html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setWordCount(plain ? plain.split(" ").length : 0);
  }, [html]);

  function sync() {
    const next = editorRef.current?.innerHTML ?? "";
    setHtml(next);
    onChange(next);
  }

  function applyLink() {
    const url = window.prompt("Link adresi girin");
    if (!url) return;
    exec("createLink", url);
    sync();
  }

  function insertImage() {
    const url = window.prompt("Görsel URL girin");
    if (!url) return;
    exec("insertImage", url);
    sync();
  }

  function applyColor(next: string) {
    setColor(next);
    exec("foreColor", next);
    sync();
  }

  function applyFontFamily(next: string) {
    setFontFamily(next);
    exec("fontName", next);
    sync();
  }

  function applyFontSize(next: string) {
    setFontSize(next);
    // execCommand fontSize uses legacy values 1-7, but it still gives a simple size change.
    const map: Record<string, string> = {
      "12px": "2",
      "14px": "3",
      "16px": "3",
      "18px": "4",
      "20px": "5",
      "24px": "6",
      "28px": "6",
      "32px": "7",
    };
    exec("fontSize", map[next] ?? "3");
    // Convert legacy <font size> tags into span styles so output stays predictable.
    requestAnimationFrame(() => {
      if (!editorRef.current) return;
      editorRef.current.querySelectorAll("font[size]").forEach((node) => {
        const font = node as HTMLElement;
        const size = font.getAttribute("size") ?? "3";
        const sizeMap: Record<string, string> = { "1": "10px", "2": "12px", "3": "16px", "4": "18px", "5": "20px", "6": "24px", "7": "32px" };
        const span = document.createElement("span");
        span.style.fontSize = sizeMap[size] ?? next;
        span.innerHTML = font.innerHTML;
        font.replaceWith(span);
      });
      sync();
    });
  }

  type ButtonSpec = { icon: JSX.Element; title: string; action: () => void };
  const buttons: ButtonSpec[] = [
    { icon: <Undo2 size={16} />, title: "Geri al", action: () => { exec("undo"); sync(); } },
    { icon: <Redo2 size={16} />, title: "İleri al", action: () => { exec("redo"); sync(); } },
    { icon: <Code2 size={16} />, title: "Kod görünümü", action: () => { exec("formatBlock", "pre"); sync(); } },
    { icon: <Slash size={16} />, title: "Temizle", action: () => { exec("removeFormat"); sync(); } },
    { icon: <Bold size={16} />, title: "Kalın", action: () => { exec("bold"); sync(); } },
    { icon: <Italic size={16} />, title: "İtalik", action: () => { exec("italic"); sync(); } },
    { icon: <Underline size={16} />, title: "Altı çizili", action: () => { exec("underline"); sync(); } },
    { icon: <AlignLeft size={16} />, title: "Sola hizala", action: () => { exec("justifyLeft"); sync(); } },
    { icon: <AlignCenter size={16} />, title: "Ortala", action: () => { exec("justifyCenter"); sync(); } },
    { icon: <AlignRight size={16} />, title: "Sağa hizala", action: () => { exec("justifyRight"); sync(); } },
    { icon: <AlignJustify size={16} />, title: "İki yana yasla", action: () => { exec("justifyFull"); sync(); } },
    { icon: <List size={16} />, title: "Madde işaretli liste", action: () => { exec("insertUnorderedList"); sync(); } },
    { icon: <ListOrdered size={16} />, title: "Numaralı liste", action: () => { exec("insertOrderedList"); sync(); } },
    { icon: <Link2 size={16} />, title: "Link ekle", action: applyLink },
    { icon: <ImageIcon size={16} />, title: "Görsel ekle", action: insertImage },
  ];

  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm font-bold text-[#1A1A1A]">{label}</p>}

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-[#F8F8F6] p-2">
          <div className="flex flex-wrap items-center gap-1 pr-2">
            {buttons.map((btn: ButtonSpec, index: number) => (
              <button
                key={index}
                type="button"
                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                onClick={btn.action}
                title={btn.title}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-gray-700 hover:border-gray-200 hover:bg-white"
              >
                {btn.icon}
              </button>
            ))}
          </div>

          <div className="mx-1 h-7 w-px bg-gray-300" />

          <label className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Pilcrow size={14} />
            <select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                if (value === "p") blockCommand("p");
                else if (value === "h1") blockCommand("h1");
                else if (value === "h2") blockCommand("h2");
                else if (value === "h3") blockCommand("h3");
                else if (value === "blockquote") blockCommand("blockquote");
                sync();
              }}
              className="appearance-none bg-transparent pr-5 outline-none"
              defaultValue="p"
            >
              <option value="p">Formats</option>
              <option value="h1">Başlık 1</option>
              <option value="h2">Başlık 2</option>
              <option value="h3">Başlık 3</option>
              <option value="blockquote">Alıntı</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 text-gray-400" />
          </label>

          <label className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Type size={14} />
            <select value={fontFamily} onChange={(e: ChangeEvent<HTMLSelectElement>) => applyFontFamily(e.target.value)} className="appearance-none bg-transparent pr-5 outline-none">
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 text-gray-400" />
          </label>

          <label className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Type size={14} />
            <select value={fontSize} onChange={(e: ChangeEvent<HTMLSelectElement>) => applyFontSize(e.target.value)} className="appearance-none bg-transparent pr-5 outline-none">
              {FONT_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 text-gray-400" />
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Paintbrush size={14} />
            <input type="color" value={color} onChange={(e: ChangeEvent<HTMLInputElement>) => applyColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0" />
          </label>

          <div className="ml-auto flex items-center gap-2 px-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-gray-600 shadow-sm">
              <Minus size={13} />
              WYSIWYG
            </span>
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={`min-h-[${minHeight}px] w-full bg-white px-5 py-4 outline-none ${label ? "" : ""}`}
          data-placeholder={placeholder ?? "Metni buraya yazın..."}
          onInput={sync}
          onBlur={sync}
          onKeyUp={sync}
          onMouseUp={sync}
          onFocus={() => {
            if (!editorRef.current) return;
            if (isEditorEmpty(editorRef.current.innerHTML)) {
              editorRef.current.innerHTML = "";
            }
          }}
          style={{ minHeight }}
          aria-label={label ?? placeholder ?? "Rich text editor"}
        />

        <div className="flex items-center justify-between border-t border-gray-200 bg-[#FAFAF8] px-4 py-2 text-[11px] text-gray-500">
          <span>{placeholder ?? "İçeriği yazın, üstteki araç çubuğuyla biçimlendirin."}</span>
          <span>Words: {wordCount}</span>
        </div>
      </div>
    </div>
  );
}
