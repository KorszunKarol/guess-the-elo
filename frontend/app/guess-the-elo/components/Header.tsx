import { Button } from "@/components/ui/button"
import { Settings, User, BarChart } from "lucide-react"

interface HeaderProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onStatsClick: () => void;
}

function Header({ onProfileClick, onSettingsClick, onStatsClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Guess the Elo
      </h1>
      <div className="flex gap-2 sm:gap-4">
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 sm:p-3" onClick={onSettingsClick}>
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 sm:p-3" onClick={onProfileClick}>
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700 p-2 sm:p-3" onClick={onStatsClick}>
          <BarChart className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

export { Header };