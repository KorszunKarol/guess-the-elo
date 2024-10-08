import ProfileCard from "@/components/ui/ProfileCard"

export default function GameStats() {
  const stats = [
    { label: "Games Played", value: "247" },
    { label: "Win Rate", value: "68%" },
    { label: "Highest Score", value: "1950" },
    { label: "Accuracy", value: "82%" },
  ]

  return (
    <ProfileCard
      title="Game Statistics"
      description="Your performance overview"
    >
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <h4 className="text-sm font-medium">{stat.label}</h4>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </ProfileCard>
  )
}