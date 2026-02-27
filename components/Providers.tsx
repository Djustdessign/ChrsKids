'use client';

import { ProgressProvider } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
