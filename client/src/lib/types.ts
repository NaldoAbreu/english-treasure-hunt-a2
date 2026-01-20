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
