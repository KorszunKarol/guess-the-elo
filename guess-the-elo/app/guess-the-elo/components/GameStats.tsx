import ProfileCard from "@/components/ui/ProfileCard"

interface GameStatsProps {
  stats: {
    gamesPlayed: number;
    winRate: number;
    highestScore: number;
    accuracy: number;
  };
}

export default function GameStats({ stats }: GameStatsProps) {
  const statItems = [
    { label: "Games Played", value: stats.gamesPlayed.toString() },
    { label: "Win Rate", value: `${stats.winRate}%` },
    { label: "Highest Score", value: stats.highestScore.toString() },
    { label: "Accuracy", value: `${stats.accuracy}%` },
  ]

  return (
    <ProfileCard
      title="Game Statistics"
      description="Your performance overview"
    >
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((stat, index) => (
          <div key={index}>
            <h4 className="text-sm font-medium">{stat.label}</h4>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </ProfileCard>
  )
}