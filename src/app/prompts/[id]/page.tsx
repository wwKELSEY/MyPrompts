"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PromptForm } from "@/app/components/PromptForm";
import { usePrompts } from "@/app/hooks/usePrompts";

export default function PromptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { getById, update, remove, ready } = usePrompts();
  const item = getById(id);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!item) return;
  
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
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

  if (!ready) {
    return <main className="min-h-screen p-8">加载中…</main>;
  }

  if (!item) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-2xl space-y-3">
          <p>找不到这条 Prompt。</p>
          <Link className="text-sm text-slate-600 hover:underline" href="/prompts">
            ← 返回列表
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">编辑 Prompt</h1>
            <p className="mt-1 text-sm text-slate-600">ID: {item.id}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link className="text-sm text-slate-600 hover:underline" href="/prompts">
              ← 返回列表
            </Link>
            <button
              onClick={handleCopy}
              className={`rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 ${
                copied ? "bg-black text-white hover:bg-black" : ""
              }`}
            >
              {copied ? "已复制 ✓" : "复制"}
            </button>

            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
              onClick={() => {
                remove(item.id);
                router.push("/prompts");
              }}
            >
              删除
            </button>
          </div>
        </div>

        <div className="rounded-xl border p-5">
          <PromptForm
            initial={{
              title: item.title,
              content: item.content,
              tags: item.tags,
              starred: item.starred,
            }}
            submitText="保存修改"
            onSubmit={(v) => {
              update(item.id, v);
              router.push("/prompts");
            }}
          />
        </div>
      </div>
    </main>
  );
}
