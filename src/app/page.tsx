import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold">Prompt Vault V1</h1>
        <p className="text-slate-600">
          一个纯前端本地 Demo：记录常用 Prompt，支持搜索、标签、收藏与本地持久化。
        </p>

        <Link
          className="inline-flex rounded-lg bg-black px-4 py-2 text-white"
          href="/prompts"
        >
          开始使用 →
        </Link>
      </div>
    </main>
  );
}
