"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SettingsModalProps {
  onSave: (settings: { roundDuration: number; numberOfRounds: number; difficulty: string }) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ onSave, isOpen, onClose }: SettingsModalProps) {
  const [roundDuration, setRoundDuration] = useState(60)
  const [numberOfRounds, setNumberOfRounds] = useState(5)
  const [difficulty, setDifficulty] = useState("medium")

  const handleSave = () => {
    onSave({ roundDuration, numberOfRounds, difficulty })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Game Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adjust the game parameters to your preference. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roundDuration" className="text-right text-gray-300">
              Round Duration (seconds)
            </Label>
            <Input
              id="roundDuration"
              type="number"
              value={roundDuration}
              onChange={(e) => setRoundDuration(Number(e.target.value))}
              className="col-span-3 bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numberOfRounds" className="text-right text-gray-300">
              Number of Rounds
            </Label>
            <Input
              id="numberOfRounds"
              type="number"
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(Number(e.target.value))}
              className="col-span-3 bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-gray-300">Difficulty</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={setDifficulty}
              className="col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" className="border-gray-600" />
                <Label htmlFor="easy" className="text-gray-300">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" className="border-gray-600" />
                <Label htmlFor="medium" className="text-gray-300">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" className="border-gray-600" />
                <Label htmlFor="hard" className="text-gray-300">Hard</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
      </DialogContent>
    </Dialog>
  )
}