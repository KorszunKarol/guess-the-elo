import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileCard from "@/components/ui/ProfileCard"

interface ProfileInfoProps {
  name: string;
  email: string;
}

export default function ProfileInfo({ name, email }: ProfileInfoProps) {
  return (
    <ProfileCard
      title="Profile Information"
      description="Manage your account details"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
    </ProfileCard>
  )
}