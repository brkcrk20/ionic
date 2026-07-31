"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";

type Lang = { tr: string; en: string };

type NavLeaf = {
  id: string;
  label: Lang;
  href: string;
};

type NavSubItem = {
  id: string;
  label: Lang;
  href: string;
  children?: NavLeaf[];
};

type NavMenuItem = {
  id: string;
  label: Lang;
  href: string;
  children?: NavSubItem[];
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function LabelHrefFields({
  label,
  href,
  onLabelChange,
  onHrefChange,
  size = "normal",
}: {
  label: Lang;
  href: string;
  onLabelChange: (label: Lang) => void;
  onHrefChange: (href: string) => void;
  size?: "normal" | "small";
}) {
  const inputClass =
    size === "small"
      ? "w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none"
      : "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <input type="text" value={label.tr} onChange={(e) => onLabelChange({ ...label, tr: e.target.value })} placeholder="Başlık (TR)" className={inputClass} />
      <input type="text" value={label.en} onChange={(e) => onLabelChange({ ...label, en: e.target.value })} placeholder="Başlık (EN)" className={inputClass} />
      <input type="text" value={href} onChange={(e) => onHrefChange(e.target.value)} placeholder="/orn-sayfa" className={`md:col-span-2 ${inputClass}`} />
    </div>
  );
}

export default function NavPanel() {
  const [items, setItems] = useState<NavMenuItem[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/nav")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.navMenu)) {
          const nextItems: NavMenuItem[] = data.navMenu;
          setItems(nextItems);
          // Menüler ve alt başlıkların altındaki kısımlar (leaf) varsayılan olarak açık gelsin,
          // böylece "alt başlıkların altındaki kısımlar" düzenleme alanı ekstra tıklama olmadan görünür.
          const nextExpanded: Record<string, boolean> = {};
          for (const item of nextItems) {
            nextExpanded[item.id] = true;
            for (const sub of item.children ?? []) {
              nextExpanded[`${item.id}:${sub.id}`] = true;
            }
          }
          setExpanded(nextExpanded);
        }
      });
  }, []);

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- Üst menü (level 1) ---
  const updateItem = (id: string, patch: Partial<NavMenuItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const t = index + dir;
      if (t < 0 || t >= next.length) return prev;
      [next[index], next[t]] = [next[t], next[index]];
      return next;
    });
  };
  const addItem = () => setItems((prev) => [...prev, { id: makeId("nav"), label: { tr: "", en: "" }, href: "/", children: [] }]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  // --- Alt başlık (level 2) ---
  const addSub = (parentId: string) => {
    const newSubId = makeId("navsub");
    setItems((prev) =>
      prev.map((it) => (it.id === parentId ? { ...it, children: [...(it.children ?? []), { id: newSubId, label: { tr: "", en: "" }, href: "/", children: [] }] } : it))
    );
    setExpanded((prev) => ({ ...prev, [parentId]: true, [`${parentId}:${newSubId}`]: true }));
  };
  const updateSub = (parentId: string, subId: string, patch: Partial<NavSubItem>) => {
    setItems((prev) => prev.map((it) => (it.id === parentId ? { ...it, children: (it.children ?? []).map((s) => (s.id === subId ? { ...s, ...patch } : s)) } : it)));
  };
  const moveSub = (parentId: string, index: number, dir: -1 | 1) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== parentId) return it;
        const arr = [...(it.children ?? [])];
        const t = index + dir;
        if (t < 0 || t >= arr.length) return it;
        [arr[index], arr[t]] = [arr[t], arr[index]];
        return { ...it, children: arr };
      })
    );
  };
  const removeSub = (parentId: string, subId: string) => {
    setItems((prev) => prev.map((it) => (it.id === parentId ? { ...it, children: (it.children ?? []).filter((s) => s.id !== subId) } : it)));
  };

  // --- Alt başlığın alt başlığı (level 3 / leaf) ---
  const addLeaf = (parentId: string, subId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === parentId
          ? { ...it, children: (it.children ?? []).map((s) => (s.id === subId ? { ...s, children: [...(s.children ?? []), { id: makeId("navleaf"), label: { tr: "", en: "" }, href: "/" }] } : s)) }
          : it
      )
    );
    setExpanded((prev) => ({ ...prev, [`${parentId}:${subId}`]: true }));
  };
  const updateLeaf = (parentId: string, subId: string, leafId: string, patch: Partial<NavLeaf>) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === parentId
          ? { ...it, children: (it.children ?? []).map((s) => (s.id === subId ? { ...s, children: (s.children ?? []).map((l) => (l.id === leafId ? { ...l, ...patch } : l)) } : s)) }
          : it
      )
    );
  };
  const moveLeaf = (parentId: string, subId: string, index: number, dir: -1 | 1) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== parentId) return it;
        return {
          ...it,
          children: (it.children ?? []).map((s) => {
            if (s.id !== subId) return s;
            const arr = [...(s.children ?? [])];
            const t = index + dir;
            if (t < 0 || t >= arr.length) return s;
            [arr[index], arr[t]] = [arr[t], arr[index]];
            return { ...s, children: arr };
          }),
        };
      })
    );
  };
  const removeLeaf = (parentId: string, subId: string, leafId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === parentId ? { ...it, children: (it.children ?? []).map((s) => (s.id === subId ? { ...s, children: (s.children ?? []).filter((l) => l.id !== leafId) } : s)) } : it
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/nav", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      setMsg(res.ok ? "Menü başarıyla güncellendi!" : "Bir hata oluştu.");
    } catch {
      setMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-sm text-gray-500">
        Navbar&apos;daki menüleri, açılır menülerdeki başlıkları ve o başlıkların altındaki alt başlıkları buradan düzenleyebilirsiniz.
        Bir başlığın altına alt başlık eklersen, o başlık kalın bir grup başlığı olarak; eklemezsen tıklanabilir tekli bir bağlantı olarak görünür.
      </p>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const subs = item.children ?? [];
          const open = expanded[item.id];
          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 bg-white">
              <LabelHrefFields
                label={item.label}
                href={item.href}
                onLabelChange={(label) => updateItem(item.id, { label })}
                onHrefChange={(href) => updateItem(item.id, { href })}
              />

              {/* SEVİYE 2: Açılır menü başlıkları */}
              <div className="border-t border-gray-100 pt-3">
                <button onClick={() => toggle(item.id)} className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black cursor-pointer">
                  {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Açılır Menü Başlıkları {subs.length > 0 ? `(${subs.length})` : ""}
                </button>

                {open && (
                  <div className="flex flex-col gap-3 mt-3 pl-4 border-l-2 border-gray-100">
                    {subs.map((sub, subIndex) => {
                      const leaves = sub.children ?? [];
                      const leafKey = `${item.id}:${sub.id}`;
                      const leafOpen = expanded[leafKey];
                      return (
                        <div key={sub.id} className="flex flex-col gap-2 bg-gray-50 rounded-md p-3">
                          <LabelHrefFields
                            label={sub.label}
                            href={sub.href}
                            onLabelChange={(label) => updateSub(item.id, sub.id, { label })}
                            onHrefChange={(href) => updateSub(item.id, sub.id, { href })}
                            size="small"
                          />

                          {/* SEVİYE 3: Bu başlığın altındaki alt başlıklar */}
                          <div className="pt-1">
                            <button onClick={() => toggle(leafKey)} className="flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-black cursor-pointer">
                              {leafOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              Bu başlığın alt başlıkları {leaves.length > 0 ? `(${leaves.length})` : ""}
                            </button>

                            {leafOpen && (
                              <div className="flex flex-col gap-2 mt-2 pl-3 border-l-2 border-gray-200">
                                {leaves.map((leaf, leafIndex) => (
                                  <div key={leaf.id} className="flex flex-col gap-1.5 bg-white border border-gray-200 rounded-md p-2.5">
                                    <LabelHrefFields
                                      label={leaf.label}
                                      href={leaf.href}
                                      onLabelChange={(label) => updateLeaf(item.id, sub.id, leaf.id, { label })}
                                      onHrefChange={(href) => updateLeaf(item.id, sub.id, leaf.id, { href })}
                                      size="small"
                                    />
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        <button onClick={() => moveLeaf(item.id, sub.id, leafIndex, -1)} disabled={leafIndex === 0} className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Yukarı taşı">
                                          <ArrowUp size={12} />
                                        </button>
                                        <button onClick={() => moveLeaf(item.id, sub.id, leafIndex, 1)} disabled={leafIndex === leaves.length - 1} className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Aşağı taşı">
                                          <ArrowDown size={12} />
                                        </button>
                                      </div>
                                      <button onClick={() => removeLeaf(item.id, sub.id, leaf.id)} className="flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 cursor-pointer">
                                        <Trash2 size={11} /> Sil
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <button onClick={() => addLeaf(item.id, sub.id)} className="flex items-center gap-1 justify-center border border-dashed border-gray-300 rounded-md py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">
                                  <Plus size={12} /> Alt Başlık Ekle
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                            <div className="flex items-center gap-1">
                              <button onClick={() => moveSub(item.id, subIndex, -1)} disabled={subIndex === 0} className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Yukarı taşı">
                                <ArrowUp size={13} />
                              </button>
                              <button onClick={() => moveSub(item.id, subIndex, 1)} disabled={subIndex === subs.length - 1} className="p-1 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Aşağı taşı">
                                <ArrowDown size={13} />
                              </button>
                            </div>
                            <button onClick={() => removeSub(item.id, sub.id)} className="flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 cursor-pointer">
                              <Trash2 size={12} /> Başlığı Sil
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button onClick={() => addSub(item.id)} className="flex items-center gap-1.5 justify-center border border-dashed border-gray-300 rounded-md py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">
                      <Plus size={13} /> Açılır Menü Başlığı Ekle
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Yukarı taşı">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer" title="Aşağı taşı">
                    <ArrowDown size={16} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer">
                  <Trash2 size={14} /> Menüyü Sil
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addItem} className="flex items-center gap-2 justify-center border border-dashed border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">
        <Plus size={16} /> Yeni Menü Ekle
      </button>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer">
          <Save size={16} /> {loading ? "Kaydediliyor..." : "Menüyü Kaydet"}
        </button>
        {msg && <p className={`text-sm ${msg.includes("başarıyla") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
      </div>
    </div>
  );
}
