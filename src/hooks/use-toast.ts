"use client";

import { useState, useCallback, useEffect } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

// Simple global toast store
const listeners = new Set<(toasts: Toast[]) => void>();
let toastList: Toast[] = [];

function emitToasts() {
  listeners.forEach((l) => l([...toastList]));
}

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2);
  const t: Toast = { id, duration: 4000, ...input };
  toastList = [...toastList, t];
  emitToasts();

  setTimeout(() => {
    toastList = toastList.filter((x) => x.id !== id);
    emitToasts();
  }, t.duration);

  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastList);

  // Subscribe to global changes
  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    toastList = toastList.filter((t) => t.id !== id);
    emitToasts();
  }, []);

  return { toasts, toast, dismiss };
}
