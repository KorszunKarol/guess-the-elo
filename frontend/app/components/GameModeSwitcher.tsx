'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function GameModeSwitcher() {
    const pathname = usePathname();

    return (
        <div className="flex space-x-4">
            <Link href="/guess-the-elo" passHref>
                <Button
                    variant={
                        pathname === '/guess-the-elo' ? 'default' : 'outline'
                    }
                >
                    Guess the Elo
                </Button>
            </Link>
            <Link href="/guess-the-eval" passHref>
                <Button
                    variant={
                        pathname === '/guess-the-eval' ? 'default' : 'outline'
                    }
                >
                    Guess the Eval
                </Button>
            </Link>
        </div>
    );
}
