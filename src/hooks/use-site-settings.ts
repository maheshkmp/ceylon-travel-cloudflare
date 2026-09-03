"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { type SiteSettings } from "@repo/validators/settings";
import { getPublicSettings } from "@/actions/settings";

export const SiteSettingsContext = createContext<Partial<SiteSettings>>({});

export function useSiteSettings() {
  const initialSettings = useContext(SiteSettingsContext);

  const { data: settings = initialSettings, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getPublicSettings(),
    initialData: initialSettings,
    staleTime: 1000 * 60 * 5,
  });

  const get = (key: keyof SiteSettings, defaultValue?: any) => {
    return (settings as any)?.[key] ?? defaultValue;
  };

  return {
    settings: (settings || {}) as Partial<SiteSettings>,
    isLoading,
    error,
    get,
  };
}
