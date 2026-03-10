import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {Game, GameStatistics} from '../types';
import {gameRepository} from '../data/GameRepository';
import {statisticsEngine} from '../engine/StatisticsEngine';

interface HistoryContextType {
  games: Game[];
  statistics: GameStatistics | null;
  loading: boolean;
  loadHistory: () => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  calculateStatistics: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedGames = await gameRepository.fetchAll();
      
      // Sort by startTime descending (newest first)
      const sortedGames = fetchedGames.sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime(),
      );
      
      setGames(sortedGames);
      
      // Calculate statistics
      const stats = statisticsEngine.calculateStatistics(sortedGames);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteGame = useCallback(async (gameId: string) => {
    try {
      await gameRepository.delete(gameId);
      setGames(prev => prev.filter(g => g.id !== gameId));
      
      // Recalculate statistics
      const updatedGames = games.filter(g => g.id !== gameId);
      const stats = statisticsEngine.calculateStatistics(updatedGames);
      setStatistics(stats);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }, [games]);

  const calculateStatistics = useCallback(() => {
    const stats = statisticsEngine.calculateStatistics(games);
    setStatistics(stats);
  }, [games]);

  const value: HistoryContextType = {
    games,
    statistics,
    loading,
    loadHistory,
    deleteGame,
    calculateStatistics,
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};
