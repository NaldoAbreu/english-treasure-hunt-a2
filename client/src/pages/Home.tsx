import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Trophy, BookOpen } from "lucide-react";
import ScenarioMap from "@/components/ScenarioMap";
import TreasureCard from "@/components/TreasureCard";
import { Scenario, Treasure } from "@/lib/types";

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>("");
  const [discoveredTreasures, setDiscoveredTreasures] = useState<Set<string>>(
    new Set()
  );
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [newlyDiscovered, setNewlyDiscovered] = useState<string | null>(null);

  useEffect(() => {
    // Load game content from public folder
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

  const currentScenario = scenarios.find((s) => s.id === currentScenarioId);
  const totalTreasures = scenarios.reduce((sum, s) => sum + s.treasures.length, 0);
  const progressPercentage = (discoveredTreasures.size / totalTreasures) * 100;

  const handleTreasureClick = (treasure: Treasure) => {
    const isNew = !discoveredTreasures.has(treasure.id);
    if (isNew) {
      setDiscoveredTreasures((prev) => new Set([...prev, treasure.id]));
      setNewlyDiscovered(treasure.id);
      setTimeout(() => setNewlyDiscovered(null), 2000);
    }
    setSelectedTreasure(treasure);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-playfair font-bold text-foreground">
                  A2 English Treasure Hunt
                </h1>
                <p className="text-sm text-muted-foreground font-lato">
                  Learn English through interactive exploration
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-lato text-muted-foreground">
                Treasures Found
              </p>
              <p className="text-2xl font-playfair font-bold text-accent">
                {discoveredTreasures.size}/{totalTreasures}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-lato">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-foreground font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            {currentScenario && (
              <motion.div
                key={currentScenarioId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-2 border-border overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-playfair">
                      {currentScenario.name}
                    </CardTitle>
                    <CardDescription className="font-lato">
                      {currentScenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScenarioMap
                      image={currentScenario.image}
                      name={currentScenario.name}
                      treasures={currentScenario.treasures}
                      discoveredTreasures={discoveredTreasures}
                      onTreasureClick={handleTreasureClick}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scenario Tabs */}
            <Card className="bg-card border-2 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={currentScenarioId}
                  onValueChange={setCurrentScenarioId}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-1 gap-2 h-auto">
                    {scenarios.map((scenario) => {
                      const scenarioTreasures = scenario.treasures.filter((t) =>
                        discoveredTreasures.has(t.id)
                      );
                      return (
                        <TabsTrigger
                          key={scenario.id}
                          value={scenario.id}
                          className="justify-start font-lato text-sm"
                        >
                          <span className="flex-1 text-left">{scenario.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {scenarioTreasures.length}/{scenario.treasures.length}
                          </Badge>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Selected Treasure Details */}
            {selectedTreasure && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <TreasureCard
                  {...selectedTreasure}
                  isNew={newlyDiscovered === selectedTreasure.id}
                />
              </motion.div>
            )}

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-playfair flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-lato">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Treasures</span>
                  <span className="font-bold text-foreground">{totalTreasures}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Discovered</span>
                  <span className="font-bold text-accent">
                    {discoveredTreasures.size}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-bold text-primary">
                    {totalTreasures - discoveredTreasures.size}
                  </span>
                </div>
                <div className="pt-2 border-t border-accent/20">
                  <p className="text-xs text-muted-foreground text-center italic">
                    {progressPercentage === 100
                      ? "🎉 Congratulations! You've completed the hunt!"
                      : "Keep exploring to find all treasures!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Discovered Treasures Section */}
        {discoveredTreasures.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <Card className="bg-card border-2 border-border">
              <CardHeader>
                <CardTitle className="text-xl font-playfair">
                  Discovered Treasures
                </CardTitle>
                <CardDescription className="font-lato">
                  All the vocabulary and grammar you've learned so far
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((scenario) =>
                    scenario.treasures
                      .filter((t) => Array.from(discoveredTreasures).includes(t.id))
                      .map((treasure) => (
                        <motion.div
                          key={treasure.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedTreasure(treasure)}
                          className="cursor-pointer"
                        >
                          <TreasureCard {...treasure} />
                        </motion.div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
