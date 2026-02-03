"use client";

import { useMemo, useState } from "react";

export function PromptForm({
  initial,
  onSubmit,
  submitText = "保存",
}: {
  initial?: { title: string; content: string; tags: string[]; starred: boolean };
  onSubmit: (v: { title: string; content: string; tags: string[]; starred: boolean }) => void;
  submitText?: string;
}) {
  const init = useMemo(
    () =>
      initial ?? {
        title: "",
        content: "",
        tags: [],
        starred: false,
      },
    [initial]
  );

  const [title, setTitle] = useState(init.title);
  const [content, setContent] = useState(init.content);
  const [tagsText, setTagsText] = useState(init.tags.join(", "));
  const [starred, setStarred] = useState(init.starred);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ title: title.trim(), content: content.trim(), tags, starred });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">标题</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：PTE Writing 模板"
        />
      </div>

      <div>
        <label className="text-sm font-medium">内容</label>
        <textarea
          className="mt-1 w-full rounded-lg border px-3 py-2"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的 prompt / 句子模板…"
        />
      </div>

      <div>
        <label className="text-sm font-medium">标签（逗号分隔）</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="PTE, Email, Work"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={starred}
          onChange={(e) => setStarred(e.target.checked)}
        />
        收藏（Star）
      </label>

      <button className="rounded-lg bg-black px-4 py-2 text-white">
        {submitText}
      </button>
    </form>
  );
}
