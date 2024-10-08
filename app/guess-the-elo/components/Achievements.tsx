import { Trophy } from "lucide-react"
import ProfileCard from "@/components/ui/ProfileCard"

export default function Achievements() {
  const trophyColors = ["text-yellow-500", "text-gray-400", "text-yellow-700"]

  return (
    <ProfileCard
      title="Achievements"
      description="Your earned badges and trophies"
    >
      <div className="flex space-x-4">
        {trophyColors.map((color, index) => (
          <Trophy key={index} className={color} size={24} />
        ))}
      </div>
    </ProfileCard>
  )
}