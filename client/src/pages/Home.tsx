import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Trophy, BookOpen, Zap, Volume2, RotateCcw } from "lucide-react";
import ScenarioMap from "@/components/ScenarioMap";
import TreasureCard from "@/components/TreasureCard";
import QuizDialog from "@/components/QuizDialog";
import AchievementsGlossary from "@/components/AchievementsGlossary";
import CelebrationEffect from "@/components/CelebrationEffect";
import { Scenario, Treasure } from "@/lib/types";
import { useGamePersistence } from "@/hooks/useGamePersistence";
import { useSpeech } from "@/hooks/useSpeech";

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>("");
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizTreasure, setQuizTreasure] = useState<Treasure | null>(null);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState(false);

  const { progress, discoverTreasure, completeQuiz, addAchievement, resetProgress } =
    useGamePersistence();
  const { speak, isSpeaking } = useSpeech();

  useEffect(() => {
    fetch("/game-content.json")
      .then((res) => res.json())
      .then((data) => {
        setScenarios(data.scenarios);
        if (data.scenarios.length > 0) {
          setCurrentScenarioId(data.scenarios[0].id);
        }
      })
      .catch((err) => console.error("Failed to load game content:", err));
  }, []);

  // Verificar conquistas
  useEffect(() => {
    const discovered = progress.discoveredTreasures.size;
    const totalTreasures = scenarios.reduce((sum, s) => sum + s.treasures.length, 0);

    if (discovered === 1 && !progress.achievements.has("first-treasure")) {
      addAchievement("first-treasure");
      setShowCelebration(true);
    }
    if (discovered === 6 && !progress.achievements.has("half-way")) {
      addAchievement("half-way");
      setShowCelebration(true);
    }
    if (discovered === totalTreasures && !progress.achievements.has("treasure-hunter")) {
      addAchievement("treasure-hunter");
      setShowCelebration(true);
    }
    if (progress.totalScore >= 50 && !progress.achievements.has("scholar")) {
      addAchievement("scholar");
    }
    if (progress.totalScore >= 100 && !progress.achievements.has("perfect-score")) {
      addAchievement("perfect-score");
      setShowCelebration(true);
    }
  }, [progress.discoveredTreasures.size, progress.totalScore]);

  const currentScenario = scenarios.find((s) => s.id === currentScenarioId);
  const totalTreasures = scenarios.reduce((sum, s) => sum + s.treasures.length, 0);
  const progressPercentage = (progress.discoveredTreasures.size / totalTreasures) * 100;

  const handleTreasureClick = (treasure: Treasure) => {
    const isNew = !progress.discoveredTreasures.has(treasure.id);

    if (isNew) {
      discoverTreasure(treasure.id, treasure.points);
      setScoreAnimation(true);
      setTimeout(() => setScoreAnimation(false), 600);
    }

    setSelectedTreasure(treasure);
    setQuizTreasure(treasure);
    setQuizOpen(true);
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect && quizTreasure && !progress.completedQuizzes.has(quizTreasure.id)) {
      completeQuiz(quizTreasure.id, 5);
      setScoreAnimation(true);
      setTimeout(() => setScoreAnimation(false), 600);
    }
    setQuizOpen(false);
  };

  const handleSpeak = (text: string) => {
    speak(text, "en-US");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      resetProgress();
      setSelectedTreasure(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <CelebrationEffect trigger={showCelebration} onComplete={() => setShowCelebration(false)} />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-amber-200">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold text-amber-900">A2 English Treasure Hunt v2.0</h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              animate={scoreAnimation ? { scale: 1.2 } : { scale: 1 }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-200 to-orange-200 px-4 py-2 rounded-full"
            >
              <Trophy className="w-5 h-5 text-amber-700" />
              <span className="font-bold text-amber-900">{progress.totalScore}</span>
            </motion.div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAchievementsOpen(true)}
              className="border-amber-300 hover:bg-amber-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Overall Progress */}
        <Card className="mb-8 border-amber-200 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-amber-900">Treasures Found</span>
                <span className="font-semibold text-amber-700">
                  {progress.discoveredTreasures.size}/{totalTreasures}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-amber-100" />
            </div>
          </CardContent>
        </Card>

        {/* Scenarios */}
        {currentScenario && (
          <div className="space-y-6">
            <Tabs
              value={currentScenarioId}
              onValueChange={setCurrentScenarioId}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-amber-100">
                {scenarios.map((scenario) => {
                  const scenarioTreasures = scenario.treasures.filter((t) =>
                    progress.discoveredTreasures.has(t.id)
                  ).length;
                  return (
                    <TabsTrigger
                      key={scenario.id}
                      value={scenario.id}
                      className="data-[state=active]:bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span>{scenario.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {scenarioTreasures}/{scenario.treasures.length}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {scenarios.map((scenario) => (
                <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
                  <Card className="border-amber-200 bg-white/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                      <CardTitle>{scenario.name}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScenarioMap
                        image={scenario.image}
                        name={scenario.name}
                        treasures={scenario.treasures}
                        discoveredTreasures={progress.discoveredTreasures}
                        onTreasureClick={handleTreasureClick}
                      />
                    </CardContent>
                  </Card>

                  {/* Treasure Details */}
                  {selectedTreasure && selectedTreasure.id.startsWith(scenario.id.charAt(0)) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <TreasureCard
                        treasure={selectedTreasure}
                        isDiscovered={progress.discoveredTreasures.has(selectedTreasure.id)}
                        onSpeak={() => handleSpeak(selectedTreasure.pronunciation)}
                        isSpeaking={isSpeaking}
                      />
                    </motion.div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </main>

      {/* Quiz Dialog */}
      {quizTreasure && (
        <QuizDialog
          open={quizOpen}
          quiz={quizTreasure.quiz}
          treasureName={quizTreasure.name}
          points={quizTreasure.points}
          onClose={() => setQuizOpen(false)}
          onAnswer={handleQuizComplete}
        />
      )}

      {/* Achievements Glossary */}
      <AchievementsGlossary
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        unlockedAchievements={progress.achievements}
        discoveries={progress.discoveredTreasures.size}
        totalTreasures={totalTreasures}
        totalScore={progress.totalScore}
      />
    </div>
  );
}
