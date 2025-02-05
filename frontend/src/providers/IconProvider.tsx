'use client';

import { LucideProps } from 'lucide-react';
import * as lucide from 'lucide-react';

export function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <lucide.LucideProvider
      value={{
        defaultProps: {
          strokeWidth: 1.5,
          className: undefined
        }
      }}
    >
      {children}
    </lucide.LucideProvider>
  );
}