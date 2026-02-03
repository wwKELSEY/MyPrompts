"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePrompts } from "@/app/hooks/usePrompts";
import { PromptCard } from "@/app/components/PromptCard";

export default function PromptsPage() {
  const { items, ready, toggleStar, remove } = usePrompts();
  const [q, setQ] = useState("");
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  type SortMode = "recent" | "title_az" | "starred_first";
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of items) {
      for (const t of p.tags) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const base = items.filter((p) => {
        if (onlyStarred && !p.starred) return false;
        if (selectedTag && !p.tags.includes(selectedTag)) return false;
    
        if (!query) return true;
        return (
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.tags.join(",").toLowerCase().includes(query)
        );
      });
    
      const sorted = base.slice();
    
      if (sortMode === "recent") {
        sorted.sort((a, b) => b.updatedAt - a.updatedAt);
      } else if (sortMode === "title_az") {
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      } else if (sortMode === "starred_first") {
        sorted.sort((a, b) => {
          // starred 先
          if (a.starred !== b.starred) return a.starred ? -1 : 1;
          // 同为 starred 或同为非 starred：再按最近更新
          return b.updatedAt - a.updatedAt;
        });
      }
    
      return sorted;
    }, [items, q, onlyStarred, selectedTag, sortMode]);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Prompts</h1>
            <p className="mt-1 text-slate-600 text-sm">
                {ready
                  ? `共 ${items.length} 条 · 当前显示 ${filtered.length} 条${
                    selectedTag ? ` · 标签 #${selectedTag}` : ""
                    }`
                  : "加载中…"}
            </p>

          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  selectedTag === null
                    ? "bg-black text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                全部
              </button>

              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag((prev) => (prev === t ? null : t))}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedTag === t ? "bg-black text-white" : "hover:bg-slate-50"
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          <Link
            className="rounded-lg bg-black px-4 py-2 text-white"
            href="/prompts/new"
          >
            + 新增
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full rounded-lg border px-3 py-2 sm:max-w-md"
            placeholder="搜索：标题 / 内容 / 标签…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="flex items-center gap-3"></div>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="sort"
            >
              <option value="recent">最新更新</option>
              <option value="title_az">标题 A-Z</option>
              <option value="starred_first">收藏优先</option>
            </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyStarred}
              onChange={(e) => setOnlyStarred(e.target.checked)}
            />
            只看收藏
          </label>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <PromptCard
              key={item.id}
              item={item}
              onToggleStar={() => toggleStar(item.id)}
              onDelete={() => remove(item.id)}
            />
          ))}

          {ready && filtered.length === 0 && (
            <div className="rounded-xl border p-6 text-slate-600">
              没有匹配的内容。试试新增一条 Prompt～
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
