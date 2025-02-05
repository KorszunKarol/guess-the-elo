export const initialPosition = [
    'R@a1', 'N@b1', 'B@c1', 'Q@d1', 'K@e1', 'B@f1', 'N@g1', 'R@h1',
    'P@a2', 'P@b2', 'P@c2', 'P@d2', 'P@e2', 'P@f2', 'P@g2', 'P@h2',
    'p@a7', 'p@b7', 'p@c7', 'p@d7', 'p@e7', 'p@f7', 'p@g7', 'p@h7',
    'r@a8', 'n@b8', 'b@c8', 'q@d8', 'k@e8', 'b@f8', 'n@g8', 'r@h8'
  ]

  export function generateRandomPosition() {
    const newPieces = [...initialPosition]
    const history = [newPieces]
    for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
      const randomIndex = Math.floor(Math.random() * newPieces.length)
      const [piece, position] = newPieces[randomIndex].split('@')
      const newPosition = `${String.fromCharCode(97 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 8) + 1}`
      newPieces[randomIndex] = `${piece}@${newPosition}`
      history.push([...newPieces])
    }
    return { newPieces, history }
  }

  export function getEloCategory(elo: number) {
    if (elo < 1200) return "Beginner"
    if (elo < 1400) return "Intermediate"
    if (elo < 1600) return "Advanced"
    if (elo < 1800) return "Expert"
    if (elo < 2000) return "Master"
    return "Grandmaster"
  }