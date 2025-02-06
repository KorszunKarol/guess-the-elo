import Link from "next/link"
import { Button } from '@/components/ui/button';
import { Settings, User, BarChart, CircuitBoardIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
    onProfileClick: () => void;
    onSettingsClick: () => void;
    onStatsClick: () => void;
}

function Header({
    onProfileClick,
    onSettingsClick,
    onStatsClick,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="max-w-screen-2xl mx-auto px-4 flex h-16 items-center">
                <div className="flex items-center gap-2">
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="text-blue-400 h-6 w-6"
                    >
                        <g fill="currentColor">
                            <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                rx="2"
                            />
                            <rect
                                x="4"
                                y="4"
                                width="8"
                                height="8"
                                className="opacity-40"
                            />
                            <rect
                                x="12"
                                y="12"
                                width="8"
                                height="8"
                                className="opacity-40"
                            />
                        </g>
                    </svg>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            ChessDetective
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
                        onClick={onSettingsClick}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#1a1b26] border-blue-800">
                            <DropdownMenuLabel className="text-blue-400">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-blue-800" />
                            <DropdownMenuItem
                                onClick={onProfileClick}
                                className="text-blue-400 hover:text-blue-300 focus:bg-blue-900/50"
                            >
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={onStatsClick}
                                className="text-blue-400 hover:text-blue-300 focus:bg-blue-900/50"
                            >
                                Statistics
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export { Header };
