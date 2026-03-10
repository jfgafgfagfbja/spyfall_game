import {Game, GameStatistics, GameWinner} from '../types';

export class StatisticsEngine {
  calculateStatistics(games: Game[]): GameStatistics {
    if (games.length === 0) {
      return {
        totalGames: 0,
        spyWins: 0,
        civilianWins: 0,
        spyWinRate: 0,
        civilianWinRate: 0,
        averageDuration: 0,
      };
    }

    const spyWins = games.filter(g => g.winner === GameWinner.Spy).length;
    const civilianWins = games.filter(
      g => g.winner === GameWinner.Civilians,
    ).length;
    const totalGames = games.length;

    return {
      totalGames,
      spyWins,
      civilianWins,
      spyWinRate: totalGames > 0 ? (spyWins / totalGames) * 100 : 0,
      civilianWinRate: totalGames > 0 ? (civilianWins / totalGames) * 100 : 0,
      averageDuration: this.getAverageDuration(games),
    };
  }

  getAverageDuration(games: Game[]): number {
    if (games.length === 0) {
      return 0;
    }

    const totalDuration = games.reduce((sum, game) => sum + game.duration, 0);
    return totalDuration / games.length;
  }

  getWinRates(games: Game[]): {spyRate: number; civilianRate: number} {
    if (games.length === 0) {
      return {spyRate: 0, civilianRate: 0};
    }

    const spyWins = games.filter(g => g.winner === GameWinner.Spy).length;
    const civilianWins = games.filter(
      g => g.winner === GameWinner.Civilians,
    ).length;

    return {
      spyRate: (spyWins / games.length) * 100,
      civilianRate: (civilianWins / games.length) * 100,
    };
  }
}

export const statisticsEngine = new StatisticsEngine();
