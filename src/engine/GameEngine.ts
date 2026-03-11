import {Game, GameWinner, PlayerCard, PlayerRole} from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

export class GameEngine {
  private readonly defaultDifficulty: Difficulty = 'hard';

  private readonly wordPairs: Array<{civilian: string; spy: string}> = [
    // Nhóm 1: Đồ ăn & Thức uống (Dễ)
    {civilian: 'Bún chả', spy: 'Bún thịt nướng'},
    {civilian: 'Phở', spy: 'Hủ tiếu'},
    {civilian: 'Trà sữa', spy: 'Trà đào'},
    {civilian: 'Cà phê', spy: 'Ca cao'},
    {civilian: 'Pizza', spy: 'Bánh xèo'},
    {civilian: 'Kem', spy: 'Sữa chua'},
    {civilian: 'Coca Cola', spy: 'Pepsi'},
    {civilian: 'Bánh mì', spy: 'Bánh bao'},
    {civilian: 'Trứng ốp la', spy: 'Trứng luộc'},
    {civilian: 'Lẩu', spy: 'Nướng'},

    // Nhóm 2: Đồ vật & Gia dụng (Trung bình)
    {civilian: 'Máy tính bàn', spy: 'Laptop'},
    {civilian: 'Điện thoại', spy: 'Máy tính bảng'},
    {civilian: 'Chổi', spy: 'Máy hút bụi'},
    {civilian: 'Bàn chải đánh răng', spy: 'Tăm bông'},
    {civilian: 'Gối', spy: 'Đệm (Nệm)'},
    {civilian: 'Sách', spy: 'Cuốn vở'},
    {civilian: 'Bút bi', spy: 'Bút chì'},
    {civilian: 'Ô (Dù)', spy: 'Áo mưa'},
    {civilian: 'Đèn pin', spy: 'Đèn ngủ'},
    {civilian: 'Gương', spy: 'Cửa sổ'},

    // Nhóm 3: Động vật & Thiên nhiên (Thú vị)
    {civilian: 'Con hổ', spy: 'Con báo'},
    {civilian: 'Con chó', spy: 'Con sói'},
    {civilian: 'Con mèo', spy: 'Con hổ'},
    {civilian: 'Con vịt', spy: 'Con thiên nga'},
    {civilian: 'Cá mập', spy: 'Cá voi'},
    {civilian: 'Rừng', spy: 'Công viên'},
    {civilian: 'Biển', spy: 'Hồ'},
    {civilian: 'Mặt trời', spy: 'Mặt trăng'},
    {civilian: 'Mưa', spy: 'Tuyết'},
    {civilian: 'Hoa hồng', spy: 'Hoa hướng dương'},

    // Nhóm 4: Hoạt động & Nghề nghiệp (Khó)
    {civilian: 'Đi bộ', spy: 'Chạy bộ'},
    {civilian: 'Xem phim', spy: 'Nghe nhạc'},
    {civilian: 'Ca sĩ', spy: 'Diễn viên'},
    {civilian: 'Bác sĩ', spy: 'Y tá'},
    {civilian: 'Giáo viên', spy: 'Gia sư'},
    {civilian: 'Nấu ăn', spy: 'Rửa bát'},
    {civilian: 'Đá bóng', spy: 'Bóng rổ'},
    {civilian: 'Chụp ảnh', spy: 'Quay phim'},
    {civilian: 'Ngủ', spy: 'Nằm mơ'},
    {civilian: 'Học bài', spy: 'Làm việc'},

    // Nhóm 5: Khái niệm trừu tượng (Thách thức)
    {civilian: 'Tình yêu', spy: 'Tình bạn'},
    {civilian: 'Giàu có', spy: 'Hạnh phúc'},
    {civilian: 'Thông minh', spy: 'Khôn lỏi'},
    {civilian: 'Bí mật', spy: 'Lời nói dối'},
    {civilian: 'Mùa hè', spy: 'Mùa thu'},
    {civilian: 'Quá khứ', spy: 'Tương lai'},
    {civilian: 'Thủ đô', spy: 'Thành phố'},
    {civilian: 'Giấc mơ', spy: 'Ác mộng'},
    {civilian: 'Thời gian', spy: 'Đồng hồ'},
    {civilian: 'Trò chơi', spy: 'Cuộc thi'},
  ];

  createGame(
    playerCount: number,
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
