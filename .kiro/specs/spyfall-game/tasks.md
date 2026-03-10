# Implementation Plan: Spyfall Game (React Native)

## Overview

Kế hoạch triển khai ứng dụng Spyfall Game cho iOS/Android sử dụng React Native và TypeScript. Implementation sẽ được chia thành các giai đoạn: thiết lập project, xây dựng data layer, business logic, contexts, và cuối cùng là UI components.

## Tasks

- [x] 1. Thiết lập React Native project
  - Tạo React Native project với TypeScript
  - Cấu hình AsyncStorage cho data persistence
  - Setup navigation (React Navigation)
  - Cấu hình ESLint và Prettier
  - Setup testing framework (Jest + React Native Testing Library)
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 2. Implement Models và Data Layer
  - [x] 2.1 Tạo TypeScript interfaces (Game, Location, LocationList, PlayerCard, enums)
    - Define interfaces theo design document
    - Export từ types/index.ts
    - _Requirements: 1.1, 2.1, 2.2, 5.1_

  - [x] 2.2 Implement Repository với AsyncStorage
    - Tạo GameRepository với CRUD operations
    - Tạo LocationRepository với CRUD operations
    - Implement error handling
    - _Requirements: 6.1, 6.5, 8.1, 8.2, 8.5_

- [ ] 3. Implement Business Logic Layer
  - [x] 3.1 Implement GameEngine
    - createGame: tạo game với random spy và location
    - selectRandomSpy: chọn spy index ngẫu nhiên
    - selectRandomLocation: chọn location ngẫu nhiên từ list
    - generatePlayerCard: tạo card cho từng player
    - evaluateVote: đánh giá vote có đúng không
    - evaluateGuess: đánh giá guess có đúng không
    - determineWinner: xác định winner dựa trên kết quả
    - _Requirements: 2.1, 2.2, 2.4, 4.2, 4.4_

  - [x] 3.2 Implement LocationManager
    - createDefaultLocationList: tạo list với 30 locations mặc định
    - validateLocationName: validate tên location không rỗng
    - isDuplicateLocation: check duplicate trong list
    - addLocation: thêm location vào list
    - updateLocation: cập nhật tên location
    - removeLocation: xóa location khỏi list
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6_

  - [x] 3.3 Implement StatisticsEngine
    - calculateStatistics: tính toán tất cả metrics
    - getMostPlayedLocations: lấy locations phổ biến nhất
    - getAverageDuration: tính thời gian trung bình
    - getWinRates: tính tỷ lệ thắng của spy và civilians
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 4. Implement Contexts
  - [x] 4.1 Implement GameContext
    - State: currentGame, gameState, timeRemaining, isTimerPaused
    - Actions: setupGame, revealCard, startGame, pauseTimer, resumeTimer, endGameWithVote, endGameWithGuess, saveGame
    - Timer logic với useEffect
    - _Requirements: 1.5, 2.3, 2.7, 3.1, 3.4, 3.5, 4.2, 4.4, 6.1_

  - [x] 4.2 Implement LocationContext
    - State: locationLists, selectedList
    - Actions: loadLocationLists, createLocationList, addLocation, updateLocation, deleteLocation, deleteLocationList
    - Error handling và validation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8_

  - [x] 4.3 Implement HistoryContext
    - State: games, statistics
    - Actions: loadHistory, deleteGame, calculateStatistics
    - _Requirements: 6.3, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 5. Implement UI Components
  - [x] 5.1 Implement GameSetup screen
    - Picker cho số người chơi (3-8)
    - Button để chọn location list
    - Button "Bắt đầu" để start game
    - Error alerts cho invalid inputs
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 5.2 Implement LocationListSelection screen
    - FlatList hiển thị tất cả location lists
    - Distinguish default vs custom lists
    - Button để tạo list mới
    - Navigation đến LocationManagement
    - _Requirements: 1.2, 5.1, 5.2_

  - [x] 5.3 Implement LocationManagement screen
    - FlatList hiển thị tất cả location lists
    - Swipe to delete cho custom lists
    - Navigation đến LocationListDetail
    - Button để tạo list mới
    - _Requirements: 5.2, 5.8_

  - [x] 5.4 Implement LocationListDetail screen
    - FlatList hiển thị locations trong list
    - Swipe to delete locations
    - Button để add location
    - Edit location inline
    - Warning nếu < 10 locations
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 5.5 Implement AddLocation modal
    - TextInput cho tên location
    - Validation real-time
    - Button "Thêm"
    - Error alerts cho duplicate/invalid names
    - _Requirements: 5.3, 5.4_

  - [x] 5.6 Implement CardReveal screen
    - Hiển thị "Player N - Nhấn để xem thẻ"
    - TouchableOpacity để reveal card
    - Card hiển thị role và location (nếu civilian)
    - Font size lớn để đọc từ xa
    - Button "Đã xem xong"
    - Màn hình chờ giữa các players
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 9.3_

  - [x] 5.7 Implement GamePlay screen
    - Timer hiển thị thời gian còn lại
    - Buttons pause/resume timer
    - Button "Kết thúc game"
    - Navigation đến GameEnd
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [x] 5.8 Implement GameEnd screen
    - Button "Bỏ phiếu"
    - Button "Spy đoán địa điểm"
    - Vote mode: FlatList tất cả players để chọn
    - Guess mode: FlatList tất cả locations để chọn
    - Navigation đến GameResult
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 5.9 Implement GameResult screen
    - Hiển thị kết quả (đúng/sai)
    - Hiển thị winner (Spy hoặc Civilians)
    - Hiển thị location thực
    - Hiển thị vai trò của tất cả players
    - Button "Lưu game"
    - Button "Chơi lại"
    - _Requirements: 4.5, 4.6, 6.1_

  - [x] 5.10 Implement History screen
    - FlatList hiển thị games theo thứ tự thời gian giảm dần
    - Mỗi row hiển thị: ngày, số players, location, winner
    - Swipe to delete
    - Navigation đến game detail
    - Empty state khi không có history
    - _Requirements: 6.3, 6.4, 6.5_

  - [x] 5.11 Implement Statistics screen
    - Hiển thị total games
    - Hiển thị spy wins và win rate
    - Hiển thị civilian wins và win rate
    - Hiển thị most played locations với counts
    - Hiển thị average duration
    - Empty state khi không có data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 5.12 Implement main navigation structure
    - Bottom Tab Navigator
    - Tabs: New Game, Locations, History, Statistics
    - Stack navigators cho mỗi tab
    - _Requirements: 9.1, 9.2_

  - [ ] 5.13 Implement styling và theming
    - Support Dark Mode và Light Mode
    - Responsive layouts cho different screen sizes
    - Smooth animations cho transitions
    - _Requirements: 9.4, 9.5, 9.6_

- [ ] 6. Integration và polish
  - [x] 6.1 Wire tất cả components lại với nhau
    - Wrap app với Context Providers
    - Setup navigation container
    - Initialize default location list nếu chưa có
    - _Requirements: 5.1, 8.3_

  - [ ] 6.2 Implement error handling UI
    - Alert components cho tất cả error cases
    - User-friendly error messages
    - Recovery actions
    - _Requirements: 1.3, 1.4, 5.4, 8.4_

  - [ ] 6.3 Performance optimization
    - Memoize expensive calculations
    - Optimize FlatList rendering
    - Lazy loading cho history list
    - _Requirements: 6.3, 7.4_

  - [ ] 6.4 Accessibility improvements
    - Accessibility labels
    - Screen reader support
    - Sufficient color contrast
    - _Requirements: 9.2_

- [ ] 7. Testing và final polish
  - Write unit tests cho business logic
  - Write integration tests cho contexts
  - Manual testing: Dark Mode, different screen sizes, animations
  - Fix any remaining bugs

## Notes

- React Native cho phép develop trên Windows và build cho iOS
- TypeScript provides type safety
- AsyncStorage cho offline data persistence
- React Navigation cho navigation flows
- Testing với Jest và React Native Testing Library
