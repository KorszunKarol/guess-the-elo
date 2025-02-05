"use client"

import { Cpu } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { EngineSettings } from "@/types/stockfish"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

interface EngineSettingsProps {
  settings: EngineSettings
  onSettingsChange: (settings: Partial<EngineSettings>) => void
}

export const EngineSettings = ({
  settings,
  onSettingsChange,
}: EngineSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Depth</span>
          <span>{settings.depth}</span>
        </div>
        <Slider
          value={[settings.depth]}
          min={10}
          max={30}
          step={1}
          onValueChange={([depth]) => onSettingsChange({ depth })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Lines</span>
          <span>{settings.multiPV}</span>
        </div>
        <Slider
          value={[settings.multiPV]}
          min={1}
          max={5}
          step={1}
          onValueChange={([multiPV]) => onSettingsChange({ multiPV })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Threads</span>
          <span>{settings.threads}</span>
        </div>
        <Slider
          value={[settings.threads]}
          min={1}
          max={8}
          step={1}
          onValueChange={([threads]) => onSettingsChange({ threads })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>CPU Usage</span>
          <span>45%</span>
        </div>
        <Progress value={45} className="h-2" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-sm text-gray-400">Auto-Analysis</div>
          <div className="text-xs text-gray-500">
            Automatically analyze new positions
          </div>
        </div>
        <Switch
          checked={settings.autoAnalysis}
          onCheckedChange={(checked) => onSettingsChange({ autoAnalysis: checked })}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-yellow-400">
        <Cpu className="h-3 w-3" />
        <span>Higher values may affect performance</span>
      </div>
    </div>
  )
} 