'use client';

import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { User, CreditCard, Trophy, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from './ProfileInfo'
import Achievements from './Achievements'

const DynamicSubscriptionInfo = dynamic(() => import('./SubscriptionInfo'), {
  loading: () => <p>Loading subscription info...</p>,
})

const DynamicGameStats = dynamic(() => import('./GameStats'), {
  loading: () => <p>Loading game stats...</p>,
})

interface ProfilePageProps {
  onClose: () => void;
  userData?: {
    name: string;
    email: string;
    subscription: string;
    subscriptionPrice: string;
    achievements: string[];
    stats: {
      gamesPlayed: number;
      winRate: number;
      highestScore: number;
      accuracy: number;
    };
  };
}

const defaultUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  subscription: "Free",
  subscriptionPrice: "$0",
  achievements: ["Beginner", "10 Games Played"],
  stats: {
    gamesPlayed: 0,
    winRate: 0,
    highestScore: 0,
    accuracy: 0,
  },
};

export default function ProfilePage({ onClose, userData = defaultUserData }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'stats', label: 'Stats' },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileInfo name={userData.name} email={userData.email} />
          <Achievements achievements={userData.achievements} />
        </TabsContent>
        <TabsContent value="subscription">
          <Suspense fallback={<p>Loading subscription info...</p>}>
            <DynamicSubscriptionInfo
              plan={userData.subscription}
              price={userData.subscriptionPrice}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="stats">
          <Suspense fallback={<p>Loading game stats...</p>}>
            <DynamicGameStats stats={userData.stats} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}