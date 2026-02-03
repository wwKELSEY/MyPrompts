"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PromptForm } from "@/app/components/PromptForm";
import { usePrompts } from "@/app/hooks/usePrompts";

export default function NewPromptPage() {
  const router = useRouter();
  const { add } = usePrompts();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">新增 Prompt</h1>
          <Link className="text-sm text-slate-600 hover:underline" href="/prompts">
            ← 返回列表
          </Link>
        </div>

        <div className="rounded-xl border p-5">
          <PromptForm
            submitText="创建"
            onSubmit={(v) => {
              const id = add(v);
              router.push(`/prompts/${id}`);
            }}
          />
        </div>
      </div>
    </main>
  );
}
