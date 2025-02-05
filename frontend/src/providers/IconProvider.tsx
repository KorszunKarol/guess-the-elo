'use client';

import { LucideProps } from 'lucide-react';
import { IconContext } from 'lucide-react';

export function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <IconContext.Provider
      value={{
        className: undefined // This prevents Lucide from adding its default classes
      }}
    >
      {children}
    </IconContext.Provider>
  );
}