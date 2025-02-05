'use client';

import dynamic from 'next/dynamic';
import { Navigation as NavigationComponent } from './Navigation';

// Correct way to dynamically import a default export
const Navigation = dynamic(() => import('./Navigation').then(mod => mod.Navigation), {
    ssr: false,
    loading: () => (
        <div className="h-16 bg-gray-900/80 border-b border-gray-700" />
    )
});

export function NavigationWrapper() {
    return <Navigation />;
}