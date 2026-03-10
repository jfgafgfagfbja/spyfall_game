import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {Game, GameState, LocationList, PlayerCard, GameResult} from '../types';
import {gameEngine} from '../engine/GameEngine';
import {gameRepository} from '../data/GameRepository';

interface GameContextType {
  currentGame: Game | null;
  currentPlayerIndex: number;
  gameState: GameState;
  timeRemaining: number;
  isTimerPaused: boolean;
  setupGame: (
    playerCount: number,
    locationList: LocationList,
    playerNames: string[],
  ) => void;
  revealCard: (playerIndex: number) => PlayerCard;
  startGame: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  endGameWithVote: (suspectedSpyIndex: number) => GameResult;
  saveGame: () => Promise<void>;
  resetGame: () => void;
  setCurrentPlayerIndex: (index: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [timeRemaining, setTimeRemaining] = useState(480); // 8 minutes
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState === GameState.Playing && !isTimerPaused && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameState(GameState.Ended);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, isTimerPaused, timeRemaining]);

  const setupGame = useCallback((
    playerCount: number,
    locationList: LocationList,
    playerNames: string[],
  ) => {
    if (playerCount < 3 || playerCount > 8) {
      throw new Error('Số người chơi phải từ 3 đến 8');
    }

    if (locationList.locations.length === 0) {
      throw new Error('Danh sách địa điểm không được rỗng');
    }

    const normalizedPlayerNames = Array.from({length: playerCount}, (_, index) => {
      const name = playerNames[index]?.trim();
      return name && name.length > 0 ? name : `Người chơi ${index + 1}`;
    });

    const game = gameEngine.createGame(
      playerCount,
      locationList,
      normalizedPlayerNames,
    );
    setCurrentGame(game);
    setCurrentPlayerIndex(0);
    setGameState(GameState.RevealingCards);
    setTimeRemaining(480);
    setIsTimerPaused(false);
  }, []);

  const revealCard = useCallback((playerIndex: number): PlayerCard => {
    if (!currentGame) {
      throw new Error('No active game');
    }
    return gameEngine.generatePlayerCard(playerIndex, currentGame);
  }, [currentGame]);

  const startGame = useCallback(() => {
    setGameState(GameState.Playing);
    setIsTimerPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerPaused(false);
  }, []);

  const endGameWithVote = useCallback((suspectedSpyIndex: number): GameResult => {
    if (!currentGame) {
      throw new Error('No active game');
    }

    const isCorrect = gameEngine.evaluateVote(suspectedSpyIndex, currentGame);
    const winner = gameEngine.determineWinner(currentGame, isCorrect, undefined);
    
    const endTime = new Date();
    const duration = (endTime.getTime() - currentGame.startTime.getTime()) / 1000;

    const updatedGame = {
      ...currentGame,
      endTime,
      duration,
      winner,
    };

    setCurrentGame(updatedGame);
    setGameState(GameState.Ended);

    return {
      isCorrect,
      winner,
      actualSpyIndex: currentGame.spyIndex,
    };
  }, [currentGame]);

  const saveGame = useCallback(async () => {
    if (!currentGame) {
      throw new Error('No active game');
    }
    await gameRepository.save(currentGame);
  }, [currentGame]);

  const resetGame = useCallback(() => {
    setCurrentGame(null);
    setCurrentPlayerIndex(0);
    setGameState(GameState.Setup);
    setTimeRemaining(480);
    setIsTimerPaused(false);
  }, []);

  const value: GameContextType = {
    currentGame,
    currentPlayerIndex,
    gameState,
    timeRemaining,
    isTimerPaused,
    setupGame,
    revealCard,
    startGame,
    pauseTimer,
    resumeTimer,
    endGameWithVote,
    saveGame,
    resetGame,
    setCurrentPlayerIndex,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
