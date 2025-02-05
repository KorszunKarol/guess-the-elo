import { Trophy } from 'lucide-react';
import ProfileCard from '@/components/ui/ProfileCard';

interface AchievementsProps {
    achievements: string[];
}

export default function Achievements({ achievements }: AchievementsProps) {
    return (
        <ProfileCard
            title="Achievements"
            description="Your earned badges and trophies"
        >
            <div className="flex space-x-4">
                {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center">
                        <Trophy className="text-yellow-500 mr-2" size={24} />
                        <span>{achievement}</span>
                    </div>
                ))}
            </div>
        </ProfileCard>
    );
}
