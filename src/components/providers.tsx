"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { getQueryClient } from "@/lib/query-client";
import { SiteSettingsContext } from "@/hooks/use-site-settings";
import { type SiteSettings } from "@repo/validators/settings";

import { InquiryWizard } from "@/components/home/InquiryWizard";

export function Providers({ 
  children,
  settings = {},
}: { 
  children: React.ReactNode;
  settings?: Partial<SiteSettings>;
}) {
  // NOTE: Avoid useState for QueryClient in Next.js 15/React 19 to prevent 
  // losing the client instance during hydration/suspense transitions.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsContext.Provider value={settings}>
        {children}
        <InquiryWizard />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </SiteSettingsContext.Provider>
    </QueryClientProvider>
  );
}
