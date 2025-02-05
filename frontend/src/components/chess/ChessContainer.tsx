import { cn } from "@/lib/utils";

interface ChessContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChessContainer = ({ children, className }: ChessContainerProps) => (
  <div className={cn(
    "relative isolate flex flex-col items-center p-4 gap-4",
    "w-full h-full mx-auto",
    className
  )}>
    {/* Background card */}
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-lg border border-gray-700/30 shadow-2xl" />

    {children}
  </div>
);