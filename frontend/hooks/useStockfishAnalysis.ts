"use client"

import { useState } from "react"
import type { StockfishLine, EngineSettings } from "@/types/stockfish"

export const useStockfishAnalysis = () => {
  const [evaluation, setEvaluation] = useState<number>(2.0)
  const [bestLines, setBestLines] = useState<StockfishLine[]>([
    { move: "e4", evaluation: 2.0, sequence: ["e4", "e5", "Nf3", "Nc6"] },
    { move: "d4", evaluation: 1.8, sequence: ["d4", "Nf6", "c4", "e6"] },
    { move: "c4", evaluation: 1.7, sequence: ["c4", "e5", "Nc3", "Nf6"] }
  ])
  const [settings, setSettings] = useState<EngineSettings>({
    depth: 20,
    multiPV: 3,
    threads: 2,
    autoAnalysis: true
  })

  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)

  const updateSettings = (newSettings: Partial<EngineSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const getEvaluationColor = (value: number): string => {
    if (Math.abs(value) < 0.5) return "text-gray-300"
    return value > 0 ? "text-blue-400" : "text-red-400"
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    // TODO: Initialize Stockfish analysis
  }

  const stopAnalysis = () => {
    setIsAnalyzing(false)
    // TODO: Stop Stockfish analysis
  }

  return {
    evaluation,
    bestLines,
    settings,
    updateSettings,
    getEvaluationColor,
    isAnalyzing,
    progress,
    startAnalysis,
    stopAnalysis,
  }
}