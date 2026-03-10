// Enums
export enum GameWinner {
  Spy = 'spy',
  Civilians = 'civilians',
  Undecided = 'undecided',
}

export enum PlayerRole {
  Spy = 'spy',
  Civilian = 'civilian',
}

export enum GameState {
  Setup = 'setup',
  RevealingCards = 'revealingCards',
  Playing = 'playing',
  Ended = 'ended',
}

// Models
export interface Location {
  id: string;
  name: string;
}

export interface LocationList {
  id: string;
  name: string;
  locations: Location[];
  isDefault: boolean;
}

export interface Game {
  id: string;
  playerCount: number;
  playerNames: string[];
  civilianWord: string;
  spyWord: string;
  spyIndex: number;
  startTime: Date;
  endTime?: Date;
  duration: number;
  winner: GameWinner;
}

export interface PlayerCard {
  playerIndex: number;
  role: PlayerRole;
  civilianWord?: string;
  spyClue?: string;
}

export interface GameResult {
  isCorrect: boolean;
  winner: GameWinner;
  actualSpyIndex: number;
}

export interface GameStatistics {
  totalGames: number;
  spyWins: number;
  civilianWins: number;
  spyWinRate: number;
  civilianWinRate: number;
  averageDuration: number;
}
