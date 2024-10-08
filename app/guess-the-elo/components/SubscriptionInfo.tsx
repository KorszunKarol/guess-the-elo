import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileCard from "@/components/ui/ProfileCard"

export default function SubscriptionInfo() {
  return (
    <ProfileCard
      title="Subscription"
      description="Manage your subscription plan"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Pro Plan</h3>
          <p className="text-sm text-muted-foreground">$9.99/month</p>
        </div>
        <CreditCard className="text-primary" size={24} />
      </div>
      <Button variant="outline" className="w-full mt-4">Upgrade Plan</Button>
    </ProfileCard>
  )
}