"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// 🐛 DEBUG: Log Convex URL
console.log('═══════════════════════════════════════════════════════');
console.log('🔧 [CONVEX CLIENT] Initializing Convex client');
console.log('🔧 [CONVEX URL]', process.env.NEXT_PUBLIC_CONVEX_URL);
console.log('🔧 [CONVEX URL DEFINED]', !!process.env.NEXT_PUBLIC_CONVEX_URL);
console.log('═══════════════════════════════════════════════════════');

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

console.log('✅ [CONVEX CLIENT] Client created successfully');

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}