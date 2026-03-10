# Spyfall Game - React Native

Ứng dụng mobile cho trò chơi xã hội Spyfall, được xây dựng bằng React Native và TypeScript.

## Tính năng

- 🎮 **Game Setup**: Thiết lập game với 3-8 người chơi
- 🃏 **Card Reveal**: Phát thẻ bí mật cho từng người chơi
- ⏱️ **Timer**: Đếm thời gian 8 phút với pause/resume
- 🗳️ **Voting**: Bỏ phiếu để tìm Gián điệp
- 🎯 **Spy Guess**: Gián điệp đoán địa điểm
- 📍 **Location Management**: Quản lý danh sách địa điểm tùy chỉnh
- 📊 **History**: Xem lịch sử các ván chơi
- 📈 **Statistics**: Thống kê tỷ lệ thắng, địa điểm phổ biến

## Công nghệ

- **React Native** 0.73
- **TypeScript** 5.3
- **React Navigation** 6.x
- **AsyncStorage** cho data persistence
- **Context API** cho state management

## Cài đặt

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn
- React Native development environment

### Các bước

1. Clone repository:
```bash
git clone <repository-url>
cd spyfall-game
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Chạy trên iOS:
```bash
npm run ios
# hoặc
yarn ios
```

4. Chạy trên Android:
```bash
npm run android
# hoặc
yarn android
```

## Cấu trúc dự án

```
src/
├── types/          # TypeScript interfaces và enums
├── data/           # Repositories (AsyncStorage)
├── engine/         # Business logic
│   ├── GameEngine.ts
│   ├── LocationManager.ts
│   └── StatisticsEngine.ts
├── context/        # React Context providers
│   ├── GameContext.tsx
│   ├── LocationContext.tsx
│   └── HistoryContext.tsx
├── screens/        # UI screens
│   ├── GameSetup.tsx
│   ├── CardReveal.tsx
│   ├── GamePlay.tsx
│   ├── GameEnd.tsx
│   ├── GameResult.tsx
│   ├── LocationListSelection.tsx
│   ├── History.tsx
│   └── Statistics.tsx
└── navigation/     # Navigation setup
    └── AppNavigator.tsx
```

## Cách chơi

1. **Thiết lập**: Chọn số người chơi (3-8) và danh sách địa điểm
2. **Phát thẻ**: Mỗi người lần lượt xem thẻ của mình
   - Dân thường: Biết địa điểm
   - Gián điệp: Không biết địa điểm
3. **Chơi game**: Đặt câu hỏi cho nhau trong 8 phút
   - Dân thường cố gắng tìm ra Gián điệp
   - Gián điệp cố gắng đoán địa điểm
4. **Kết thúc**: Bỏ phiếu hoặc Gián điệp đoán địa điểm
5. **Kết quả**: Xem ai thắng và lưu game

## Danh sách địa điểm mặc định

Ứng dụng có sẵn 30 địa điểm phổ biến:
- Sân bay, Bệnh viện, Trường học, Ngân hàng
- Rạp chiếu phim, Nhà hàng, Khách sạn, Bãi biển
- Siêu thị, Công viên, Bảo tàng, Thư viện
- Và nhiều địa điểm khác...

Bạn cũng có thể tạo danh sách địa điểm tùy chỉnh!

## License

MIT
