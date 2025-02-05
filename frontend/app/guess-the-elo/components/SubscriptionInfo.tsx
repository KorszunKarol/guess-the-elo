import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileCard from "@/components/ui/ProfileCard"

interface SubscriptionInfoProps {
  plan: string;
  price: string;
}

export default function SubscriptionInfo({ plan, price }: SubscriptionInfoProps) {
  return (
    <ProfileCard
      title="Subscription"
      description="Manage your subscription plan"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{plan}</h3>
          <p className="text-sm text-muted-foreground">{price}</p>
        </div>
        <CreditCard className="text-primary" size={24} />
      </div>
      <Button variant="outline" className="w-full mt-4">Upgrade Plan</Button>
    </ProfileCard>
  )
}