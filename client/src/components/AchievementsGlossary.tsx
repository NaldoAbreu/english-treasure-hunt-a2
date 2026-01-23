import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: number;
}

interface AchievementsGlossaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlockedAchievements: Set<string>;
  discoveries: number;
  totalTreasures: number;
  totalScore: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-treasure",
    name: "First Discovery",
    description: "Discover your first treasure",
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: "half-way",
    name: "Halfway There",
    description: "Discover 6 treasures",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "treasure-hunter",
    name: "Treasure Hunter",
    description: "Discover all 12 treasures",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get 100 points",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "scholar",
    name: "English Scholar",
    description: "Get 50 points",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "hotel-master",
    name: "Hotel Master",
    description: "Discover all Hotel Lobby treasures",
    icon: <Trophy className="w-5 h-5" />,
  },
];

export default function AchievementsGlossary({
  open,
  onOpenChange,
  unlockedAchievements,
  discoveries,
  totalTreasures,
  totalScore,
}: AchievementsGlossaryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Achievements & Glossary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{discoveries}</div>
              <div className="text-sm text-blue-700">Treasures Found</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{totalScore}</div>
              <div className="text-sm text-green-700">Total Points</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {unlockedAchievements.size}/{ACHIEVEMENTS.length}
              </div>
              <div className="text-sm text-purple-700">Achievements</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedAchievements.has(achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    variants={itemVariants}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isUnlocked
                        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isUnlocked
                            ? "bg-amber-200 text-amber-700"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {achievement.description}
                        </div>
                        {isUnlocked && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            ✓ Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Treasures Discovered</span>
                  <span className="font-semibold">
                    {discoveries}/{totalTreasures}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(discoveries / totalTreasures) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Points Earned</span>
                  <span className="font-semibold">{totalScore}/120</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((totalScore / 120) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
