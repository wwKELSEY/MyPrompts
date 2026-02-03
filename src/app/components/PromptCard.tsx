"use client";

import Link from "next/link";
import { useState } from "react";
import type { PromptItem } from "@/app/types/prompt";

export function PromptCard({
  item,
  onToggleStar,
  onDelete,
}: {
  item: PromptItem;
  onToggleStar: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // 兼容极少数 clipboard 不可用场景：降级用 textarea
      const el = document.createElement("textarea");
      el.value = item.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/prompts/${item.id}`}
            className="font-semibold hover:underline"
          >
            {item.title || "Untitled"}
          </Link>

          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700">
            {item.content}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button
            onClick={onToggleStar}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
            aria-label="toggle star"
          >
            {item.starred ? "★" : "☆"}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
          >
            {copied ? "已复制" : "复制"}
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}