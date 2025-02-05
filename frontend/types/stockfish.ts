export interface StockfishLine {
  move: string
  evaluation: number
  sequence: string[]
}

export interface EngineSettings {
  depth: number
  multiPV: number
  threads: number
  autoAnalysis: boolean
}