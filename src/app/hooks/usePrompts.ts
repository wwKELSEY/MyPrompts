"use client";

import { useEffect, useMemo, useState } from "react";
import type { PromptItem } from "@/app/types/prompt";
import { loadPrompts, savePrompts } from "@/app/lib/storage";

export function usePrompts() {
  const [items, setItems] = useState<PromptItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadPrompts());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePrompts(items);
  }, [items, ready]);

  const api = useMemo(() => {
    return {
      items,
      ready,
      add: (data: Omit<PromptItem, "id" | "updatedAt">) => {
        const now = Date.now();
        const newItem: PromptItem = {
          id: crypto.randomUUID(),
          updatedAt: now,
          ...data,
        };
        setItems((prev) => [newItem, ...prev]);
        return newItem.id;
      },
      update: (id: string, patch: Partial<Omit<PromptItem, "id">>) => {
        setItems((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p
          )
        );
      },
      remove: (id: string) => {
        setItems((prev) => prev.filter((p) => p.id !== id));
      },
      toggleStar: (id: string) => {
        setItems((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, starred: !p.starred, updatedAt: Date.now() } : p
          )
        );
      },
      getById: (id: string) => items.find((p) => p.id === id) || null,
    };
  }, [items, ready]);

  return api;
}
