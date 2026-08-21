"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "@/i18n/config";
import { I18nextProvider } from "react-i18next";
import { AccessibilityProvider } from "@/features/accessibility/accessibility-context";
import KeyboardNav from "@/features/accessibility/KeyboardNav";
import { NepalAdminProvider } from "@/lib/geo/nepal-admin-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 mins
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AccessibilityProvider>
          <NepalAdminProvider>
            {children}
            <KeyboardNav />
          </NepalAdminProvider>
        </AccessibilityProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
