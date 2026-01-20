export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Treasure {
  id: string;
  name: string;
  x: number;
  y: number;
  vocabulary: string;
  explanation: string;
  example: string;
  grammarTopic: string;
  difficulty: string;
  points: number;
  quiz: Quiz;
}

export interface Scenario {
  id: string;
  name: string;
  image: string;
  description: string;
  treasures: Treasure[];
}

export interface GameState {
  currentScenarioId: string;
  discoveredTreasures: Set<string>;
  totalTreasures: number;
}
