import {Game, GameWinner, Location, LocationList, PlayerCard, PlayerRole} from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

export class GameEngine {
  private readonly defaultDifficulty: Difficulty = 'hard';

  private readonly wordPairs: Array<{civilian: string; spy: string}> = [
    {civilian: 'Cửa khởi hành', spy: 'Quầy check-in'},
    {civilian: 'Băng ca', spy: 'Phòng cấp cứu'},
    {civilian: 'Bảng đen', spy: 'Sân trường'},
    {civilian: 'Két sắt', spy: 'Quầy giao dịch'},
    {civilian: 'Vé xem phim', spy: 'Bắp rang'},
    {civilian: 'Thực đơn', spy: 'Bếp trưởng'},
    {civilian: 'Lễ tân', spy: 'Phòng suite'},
    {civilian: 'Cát trắng', spy: 'Kem chống nắng'},
    {civilian: 'Xe đẩy hàng', spy: 'Quầy thanh toán'},
    {civilian: 'Xích đu', spy: 'Đường chạy bộ'},
    {civilian: 'Hiện vật', spy: 'Hướng dẫn viên'},
    {civilian: 'Kệ sách', spy: 'Thẻ mượn'},
    {civilian: 'Chuồng thú', spy: 'Người chăm sóc'},
    {civilian: 'Sân ga', spy: 'Vé tàu'},
    {civilian: 'Cầu cảng', spy: 'Container'},
    {civilian: 'Doanh trại', spy: 'Lính gác'},
    {civilian: 'Hộ chiếu', spy: 'Lãnh sự'},
    {civilian: 'Bàn roulette', spy: 'Máy đánh bạc'},
    {civilian: 'Tinh dầu', spy: 'Massage'},
    {civilian: 'Máy chạy bộ', spy: 'Tạ đòn'},
    {civilian: 'Phòng họp', spy: 'Thẻ nhân viên'},
    {civilian: 'Dây chuyền', spy: 'Công nhân ca'},
    {civilian: 'Kính tiềm vọng', spy: 'Khoang áp suất'},
    {civilian: 'Buồng khí', spy: 'Không trọng lực'},
    {civilian: 'Lều xiếc', spy: 'Chú hề'},
    {civilian: 'Cô dâu', spy: 'Bó hoa cưới'},
    {civilian: 'Tiếp viên', spy: 'Dây an toàn'},
    {civilian: 'Boong tàu', spy: 'Kho báu'},
    {civilian: 'Đạo diễn', spy: 'Máy quay'},
    {civilian: 'Laptop trưng bày', spy: 'Kệ phụ kiện'},
  ];

  createGame(
    playerCount: number,
    locationList: LocationList,
    playerNames: string[],
  ): Game {
    const spyIndex = this.selectRandomSpy(playerCount);
    const pair = this.selectRandomWordPair(this.defaultDifficulty);
    
    return {
      id: this.generateId(),
      playerCount,
      playerNames,
      civilianWord: pair.civilian,
      spyWord: pair.spy,
      spyIndex,
      startTime: new Date(),
      duration: 0,
      winner: GameWinner.Undecided,
    };
  }

  selectRandomSpy(playerCount: number): number {
    return Math.floor(Math.random() * playerCount);
  }

  selectRandomWordPair(_difficulty: Difficulty = this.defaultDifficulty): {civilian: string; spy: string} {
    const randomIndex = Math.floor(Math.random() * this.wordPairs.length);
    return this.wordPairs[randomIndex];
  }

  generatePlayerCard(playerIndex: number, game: Game): PlayerCard {
    if (playerIndex === game.spyIndex) {
      return {
        playerIndex,
        role: PlayerRole.Spy,
        spyClue: game.spyWord,
      };
    }
    
    return {
      playerIndex,
      role: PlayerRole.Civilian,
      civilianWord: game.civilianWord,
    };
  }

  evaluateVote(suspectedIndex: number, game: Game): boolean {
    return suspectedIndex === game.spyIndex;
  }

  determineWinner(
    game: Game,
    voteCorrect?: boolean,
    guessCorrect?: boolean,
  ): GameWinner {
    // If vote happened
    if (voteCorrect !== undefined) {
      return voteCorrect ? GameWinner.Civilians : GameWinner.Spy;
    }
    
    return GameWinner.Undecided;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const gameEngine = new GameEngine();
