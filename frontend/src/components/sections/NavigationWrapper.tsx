'use client';

import dynamic from 'next/dynamic';
import { Navigation as NavigationComponent } from './Navigation';


const Navigation = dynamic(() => import('./Navigation').then(mod => mod.Navigation), {
    ssr: false,
    loading: () => (
        <nav className="px-6 py-8" />
    )
});

export function NavigationWrapper() {
    return <Navigation />;
}