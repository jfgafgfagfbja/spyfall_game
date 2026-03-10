import AsyncStorage from '@react-native-async-storage/async-storage';
import {Game} from '../types';

const GAMES_KEY = '@spyfall_games';

export class GameRepository {
  async save(game: Game): Promise<void> {
    try {
      const games = await this.fetchAll();
      const existingIndex = games.findIndex(g => g.id === game.id);
      
      if (existingIndex >= 0) {
        games[existingIndex] = game;
      } else {
        games.push(game);
      }
      
      await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
    } catch (error) {
      console.error('Error saving game:', error);
      throw new Error('Không thể lưu game. Vui lòng thử lại.');
    }
  }

  async fetchAll(): Promise<Game[]> {
    try {
      const data = await AsyncStorage.getItem(GAMES_KEY);
      if (!data) {
        return [];
      }
      
      const games = JSON.parse(data);
      // Convert date strings back to Date objects
      return games.map((game: any) => ({
        ...game,
        startTime: new Date(game.startTime),
        endTime: game.endTime ? new Date(game.endTime) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async delete(gameId: string): Promise<void> {
    try {
      const games = await this.fetchAll();
      const filtered = games.filter(g => g.id !== gameId);
      await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting game:', error);
      throw new Error('Không thể xóa game. Vui lòng thử lại.');
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(GAMES_KEY);
    } catch (error) {
      console.error('Error clearing games:', error);
      throw new Error('Không thể xóa dữ liệu.');
    }
  }
}

export const gameRepository = new GameRepository();
