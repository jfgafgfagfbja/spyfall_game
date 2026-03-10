# Design Document - Spyfall Game

## Overview

Spyfall Game là một ứng dụng mobile cross-platform được xây dựng bằng React Native và TypeScript, cho phép 3-8 người chơi tham gia trò chơi xã hội trực tiếp. Ứng dụng sử dụng kiến trúc component-based với React hooks và context API để quản lý state, với AsyncStorage làm lớp persistence.

Thiết kế tập trung vào trải nghiệm người dùng mượt mà khi nhiều người chơi chia sẻ cùng một thiết bị, đảm bảo tính bí mật của thông tin vai trò, và cung cấp khả năng quản lý dữ liệu offline hoàn toàn.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  React Components                       │
│  (GameSetup, CardReveal, GamePlay, etc.)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Context & Hooks                            │
│  (GameContext, LocationContext, HistoryContext)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Business Logic                         │
│     (GameEngine, LocationManager, StatisticsEngine)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                             │
│              (AsyncStorage, Repository)                 │
└─────────────────────────────────────────────────────────┘
```

### Architecture Layers

1. **Component Layer (React Native)**
   - GameSetup: Chọn số người chơi và location list
   - LocationListSelection: Chọn location list (default hoặc custom)
   - LocationManagement: Quản lý các location lists
   - LocationListDetail: Xem và chỉnh sửa locations trong một list
   - AddLocation: Thêm location mới
   - CardReveal: Hiển thị thẻ cho từng người chơi
   - GamePlay: Màn hình chơi game với timer
   - GameEnd: Bỏ phiếu hoặc đoán địa điểm
   - GameResult: Hiển thị kết quả
   - History: Xem lịch sử các ván chơi
   - Statistics: Xem thống kê
   - Không chứa business logic
   - Sử dụng React hooks và Context API

2. **Context Layer**
   - Quản lý global state với React Context
   - Provide state và actions cho components
   - Handle side effects với useEffect

3. **Business Logic Layer**
   - GameEngine: Xử lý logic trò chơi (phát thẻ, chọn spy, kết thúc game)
   - LocationManager: Quản lý danh sách địa điểm
   - StatisticsEngine: Tính toán thống kê

4. **Data Layer**
   - AsyncStorage cho persistence
   - Repository pattern để abstract data access
   - TypeScript interfaces cho type safety

## Components and Interfaces

### 1. Models

#### Game Model
```typescript
interface Game {
    id: string;
    playerCount: number;
    location: Location;
    spyIndex: number;
    startTime: Date;
    endTime?: Date;
    duration: number;
    winner: GameWinner;
    locationListName: string;
}

enum GameWinner {
    Spy = 'spy',
    Civilians = 'civilians',
    Undecided = 'undecided'
}
```

#### Location Model
```typescript
interface Location {
    id: string;
    name: string;
}
```

#### LocationList Model
```typescript
interface LocationList {
    id: string;
    name: string;
    locations: Location[];
    isDefault: boolean;
}
```

#### PlayerCard Model
```typescript
interface PlayerCard {
    playerIndex: number;
    role: PlayerRole;
    location?: Location;
}

enum PlayerRole {
    Spy = 'spy',
    Civilian = 'civilian'
}
```

### 2. ViewModels

#### GameViewModel
```swift
class GameViewModel: ObservableObject {
    @Published var currentGame: Game?
    @Published var currentPlayerIndex: Int = 0
    @Published var gameState: GameState = .setup
    @Published var timeRemaining: TimeInterval = 480 // 8 minutes
    @Published var isTimerPaused: Bool = false
    
    private let gameEngine: GameEngine
    private let repository: GameRepository
    private var timer: Timer?
    
    func setupGame(playerCount: Int, locationList: LocationList)
    func revealCard(for playerIndex: Int) -> PlayerCard
    func startGame()
    func pauseTimer()
    func resumeTimer()
    func endGameWithVote(suspectedSpyIndex: Int) -> GameResult
    func endGameWithGuess(guessedLocation: Location) -> GameResult
    func saveGame()
}

enum GameState {
    case setup
    case revealingCards
    case playing
    case ended
}

struct GameResult {
    let isCorrect: Bool
    let winner: GameWinner
    let actualLocation: Location
    let actualSpyIndex: Int
}
```

#### LocationViewModel
```swift
class LocationViewModel: ObservableObject {
    @Published var locationLists: [LocationList] = []
    @Published var selectedList: LocationList?
    
    private let locationManager: LocationManager
    private let repository: LocationRepository
    
    func loadLocationLists()
    func createLocationList(name: String) -> LocationList
    func addLocation(to listId: UUID, name: String) throws
    func updateLocation(id: UUID, newName: String) throws
    func deleteLocation(id: UUID, from listId: UUID)
    func deleteLocationList(id: UUID)
    func getDefaultLocationList() -> LocationList
}
```

#### HistoryViewModel
```swift
class HistoryViewModel: ObservableObject {
    @Published var games: [Game] = []
    @Published var statistics: GameStatistics?
    
    private let repository: GameRepository
    private let statisticsEngine: StatisticsEngine
    
    func loadHistory()
    func deleteGame(id: UUID)
    func calculateStatistics()
}

struct GameStatistics {
    let totalGames: Int
    let spyWins: Int
    let civilianWins: Int
    let spyWinRate: Double
    let civilianWinRate: Double
    let mostPlayedLocations: [(Location, Int)]
    let averageDuration: TimeInterval
}
```

### 3. Business Logic Components

#### GameEngine
```swift
class GameEngine {
    func createGame(playerCount: Int, locationList: LocationList) -> Game
    func selectRandomSpy(playerCount: Int) -> Int
    func selectRandomLocation(from list: LocationList) -> Location
    func generatePlayerCard(for index: Int, in game: Game) -> PlayerCard
    func evaluateVote(suspectedIndex: Int, in game: Game) -> Bool
    func evaluateGuess(location: Location, in game: Game) -> Bool
    func determineWinner(game: Game, voteCorrect: Bool?, guessCorrect: Bool?) -> GameWinner
}
```

#### LocationManager
```swift
class LocationManager {
    func createDefaultLocationList() -> LocationList
    func validateLocationName(_ name: String, in list: LocationList) -> Bool
    func isDuplicateLocation(_ name: String, in list: LocationList) -> Bool
    func addLocation(name: String, to list: LocationList) throws -> LocationList
    func updateLocation(id: UUID, newName: String, in list: LocationList) throws -> LocationList
    func removeLocation(id: UUID, from list: LocationList) -> LocationList
}
```

#### StatisticsEngine
```swift
class StatisticsEngine {
    func calculateStatistics(from games: [Game]) -> GameStatistics
    func getMostPlayedLocations(from games: [Game], limit: Int) -> [(Location, Int)]
    func getAverageDuration(from games: [Game]) -> TimeInterval
    func getWinRates(from games: [Game]) -> (spyRate: Double, civilianRate: Double)
}
```

### 4. Data Layer

#### Core Data Entities

**GameEntity**
- id: UUID
- playerCount: Int16
- locationName: String
- spyIndex: Int16
- startTime: Date
- endTime: Date?
- duration: Double
- winner: String (enum raw value)
- locationListName: String

**LocationEntity**
- id: UUID
- name: String
- locationList: LocationListEntity (relationship)

**LocationListEntity**
- id: UUID
- name: String
- isDefault: Bool
- locations: Set<LocationEntity> (relationship)

#### Repository Interfaces

```swift
protocol GameRepository {
    func save(game: Game) throws
    func fetchAll() -> [Game]
    func delete(gameId: UUID) throws
}

protocol LocationRepository {
    func save(locationList: LocationList) throws
    func fetchAll() -> [LocationList]
    func update(locationList: LocationList) throws
    func delete(listId: UUID) throws
}
```

## Data Models

### Core Data Schema

```
LocationListEntity
├── id: UUID (Primary Key)
├── name: String
├── isDefault: Bool
└── locations: [LocationEntity] (One-to-Many)

LocationEntity
├── id: UUID (Primary Key)
├── name: String
└── locationList: LocationListEntity (Many-to-One)

GameEntity
├── id: UUID (Primary Key)
├── playerCount: Int16
├── locationName: String
├── spyIndex: Int16
├── startTime: Date
├── endTime: Date?
├── duration: Double
├── winner: String
└── locationListName: String
```

### Default Location List

Ứng dụng sẽ khởi tạo một LocationList mặc định với 30 địa điểm phổ biến:

1. Sân bay
2. Bệnh viện
3. Trường học
4. Ngân hàng
5. Rạp chiếu phim
6. Nhà hàng
7. Khách sạn
8. Bãi biển
9. Siêu thị
10. Công viên
11. Bảo tàng
12. Thư viện
13. Sở thú
14. Ga tàu
15. Cảng biển
16. Căn cứ quân sự
17. Đại sứ quán
18. Casino
19. Spa
20. Phòng gym
21. Công ty
22. Nhà máy
23. Tàu ngầm
24. Trạm vũ trụ
25. Rạp xiếc
26. Đám cưới
27. Chuyến bay
28. Tàu cướp biển
29. Phim trường
30. Siêu thị điện tử

### Custom Location Management

Người dùng có thể tạo và quản lý các LocationList tùy chỉnh:

**Tạo LocationList mới**:
- Người dùng đặt tên cho list (ví dụ: "Địa điểm Việt Nam", "Địa điểm Fantasy")
- List bắt đầu rỗng, người dùng thêm locations vào

**Thêm Location**:
- Người dùng nhập tên location (ví dụ: "Chợ Bến Thành", "Vịnh Hạ Long")
- System validate: không trùng tên trong cùng list, không rỗng
- Location được thêm vào list

**Sửa Location**:
- Người dùng chọn location từ list
- Nhập tên mới
- System validate và cập nhật

**Xóa Location**:
- Người dùng chọn location và xác nhận xóa
- Location bị xóa khỏi list

**Xóa LocationList**:
- Người dùng chọn list và xác nhận xóa
- Toàn bộ list và các locations trong đó bị xóa
- Không thể xóa default list

**Sử dụng Custom List**:
- Khi setup game, người dùng chọn list muốn dùng (default hoặc custom)
- Game sẽ random location từ list đã chọn

## Correctness Properties

*Correctness properties là các đặc tính hoặc hành vi phải đúng trong mọi trường hợp thực thi của hệ thống - về cơ bản là các phát biểu chính thức về những gì hệ thống nên làm. Properties đóng vai trò là cầu nối giữa đặc tả có thể đọc được bởi con người và các đảm bảo tính đúng đắn có thể kiểm chứng bằng máy.*


### Property 1: Player count validation
*For any* player count value, the system should accept it if and only if it is in the range [3, 8]
**Validates: Requirements 1.1, 1.3**

### Property 2: Empty location list rejection
*For any* location list, if it is empty, the system should reject it and not allow game creation
**Validates: Requirements 1.4**

### Property 3: Spy selection bounds
*For any* game with N players, the selected spy index must be in the range [0, N-1]
**Validates: Requirements 2.1**

### Property 4: Location selection validity
*For any* game created with a location list L, the selected location must be a member of L
**Validates: Requirements 2.2**

### Property 5: Player card correctness
*For any* game and player index, if the player is the spy then their card must have role=spy and location=nil, otherwise their card must have role=civilian and location equal to the game's location
**Validates: Requirements 2.4**

### Property 6: Game state transition after card reveal
*For any* game, after all players have revealed their cards, the game state must transition to playing and the timer must be started
**Validates: Requirements 2.7**

### Property 7: Timer pause-resume round-trip
*For any* game with timer at time T, pausing then immediately resuming should result in the timer remaining at time T
**Validates: Requirements 3.4, 3.5**

### Property 8: Vote evaluation correctness
*For any* game and suspected player index, the vote is correct if and only if the suspected index equals the spy index
**Validates: Requirements 4.2**

### Property 9: Guess evaluation correctness
*For any* game and guessed location, the guess is correct if and only if the guessed location equals the game's actual location
**Validates: Requirements 4.4**

### Property 10: Location addition
*For any* location list and new location name, after adding the location, it must appear in the list
**Validates: Requirements 5.3**

### Property 11: Duplicate location rejection
*For any* location list and location name that already exists in the list, attempting to add it again should be rejected and the list should remain unchanged
**Validates: Requirements 5.4**

### Property 12: Location update
*For any* location in a list, after updating its name to a new valid name, the location must have the new name
**Validates: Requirements 5.5**

### Property 13: Location deletion
*For any* location in a list, after deleting it, the location must not appear in the list
**Validates: Requirements 5.6**

### Property 14: Location list deletion
*For any* location list, after deleting it, the list must not exist in the system
**Validates: Requirements 5.8**

### Property 15: Game persistence round-trip
*For any* valid game, saving it to Core Data then loading it back should produce a game with equivalent data (playerCount, location name, spyIndex, startTime, endTime, duration, winner, locationListName)
**Validates: Requirements 6.1, 6.2, 8.2**

### Property 16: Game history ordering
*For any* set of saved games, when fetching game history, the games must be ordered by startTime in descending order (newest first)
**Validates: Requirements 6.3**

### Property 17: Game history deletion
*For any* game in history, after deleting it, the game must not appear in the history
**Validates: Requirements 6.5**

### Property 18: Statistics calculation correctness
*For any* set of games in history, the calculated statistics must satisfy:
- totalGames equals the count of games
- spyWins equals the count of games where winner=spy
- civilianWins equals the count of games where winner=civilians
- spyWinRate equals spyWins / totalGames (or 0 if totalGames=0)
- civilianWinRate equals civilianWins / totalGames (or 0 if totalGames=0)
- averageDuration equals sum of all durations / totalGames (or 0 if totalGames=0)
**Validates: Requirements 7.1, 7.2, 7.3, 7.5**

### Property 19: Most played locations correctness
*For any* set of games in history, the most played locations list must be sorted by frequency in descending order, and each location's count must equal the number of games where that location was used
**Validates: Requirements 7.4**

### Property 20: Location list persistence round-trip
*For any* valid location list with locations, saving it to Core Data then loading it back should produce a location list with equivalent data (name, isDefault, and all location names)
**Validates: Requirements 5.3, 8.1**

### Property 21: Data integrity on failed writes
*For any* data write operation that fails, the existing data in Core Data must remain unchanged and uncorrupted
**Validates: Requirements 8.5**

## Error Handling

### Validation Errors

**Invalid Player Count**
- Trigger: User selects player count < 3 or > 8
- Response: Display alert "Số người chơi phải từ 3 đến 8"
- Recovery: Return to setup screen with previous valid value

**Empty Location List**
- Trigger: User attempts to start game with empty location list
- Response: Display alert "Danh sách địa điểm không được rỗng"
- Recovery: Return to location list selection

**Duplicate Location Name**
- Trigger: User attempts to add location with name already in list
- Response: Display alert "Địa điểm này đã tồn tại trong danh sách"
- Recovery: Clear input field, keep user on add location screen

**Invalid Location Name**
- Trigger: User attempts to add/update location with empty or whitespace-only name
- Response: Display alert "Tên địa điểm không được để trống"
- Recovery: Keep user on current screen with input focused

### Core Data Errors

**Save Failure**
- Trigger: Core Data save operation fails
- Response: Log error, display alert "Không thể lưu dữ liệu. Vui lòng thử lại."
- Recovery: Rollback transaction, keep current in-memory state

**Fetch Failure**
- Trigger: Core Data fetch operation fails
- Response: Log error, return empty array
- Recovery: Continue with empty data, allow user to create new data

**Corrupted Data**
- Trigger: App launch detects corrupted Core Data store
- Response: Display alert "Dữ liệu bị lỗi. Khởi tạo dữ liệu mặc định."
- Recovery: Delete corrupted store, create new store with default location list

**Migration Failure**
- Trigger: Core Data model version migration fails
- Response: Log error, display alert "Không thể nâng cấp dữ liệu"
- Recovery: Offer option to reset data or contact support

### Runtime Errors

**Timer Failure**
- Trigger: Timer fails to start or update
- Response: Log error, allow manual time tracking
- Recovery: Disable timer UI, show manual controls

**Random Generation Failure**
- Trigger: Random number generation fails (extremely rare)
- Response: Log error, use fallback deterministic selection
- Recovery: Use first location and first player as spy

## Testing Strategy

### Dual Testing Approach

Ứng dụng sẽ sử dụng cả **unit tests** và **property-based tests** để đảm bảo tính đúng đắn toàn diện:

- **Unit tests**: Kiểm tra các ví dụ cụ thể, edge cases, và error conditions
- **Property tests**: Kiểm tra các properties phổ quát trên nhiều inputs ngẫu nhiên

### Property-Based Testing Configuration

**Framework**: Sử dụng [swift-check](https://github.com/typelift/SwiftCheck) cho property-based testing trong Swift

**Configuration**:
- Mỗi property test chạy tối thiểu 100 iterations với inputs ngẫu nhiên
- Mỗi test được tag với format: `Feature: spyfall-game, Property N: [property text]`
- Mỗi correctness property phải được implement bởi CHÍNH XÁC MỘT property-based test

**Example Test Structure**:
```swift
func testProperty1_PlayerCountValidation() {
    // Feature: spyfall-game, Property 1: Player count validation
    property("Player count validation") <- forAll { (count: Int) in
        let isValid = (3...8).contains(count)
        let result = GameEngine.validatePlayerCount(count)
        return result == isValid
    }
}
```

### Unit Testing Strategy

**Focus Areas**:
1. **Specific Examples**: Test concrete scenarios như "game với 5 người chơi"
2. **Edge Cases**: 
   - Minimum players (3)
   - Maximum players (8)
   - Empty location list
   - Single location in list
   - Timer at 0
   - Empty game history
3. **Error Conditions**:
   - Invalid player counts (2, 9, -1)
   - Duplicate location names
   - Core Data save failures
   - Corrupted data recovery

**Example Unit Test**:
```swift
func testGameCreationWith5Players() {
    let locationList = LocationList(name: "Test", locations: [Location(name: "Beach")])
    let game = gameEngine.createGame(playerCount: 5, locationList: locationList)
    
    XCTAssertEqual(game.playerCount, 5)
    XCTAssertTrue((0..<5).contains(game.spyIndex))
    XCTAssertEqual(game.location.name, "Beach")
}
```

### Test Coverage Goals

- **Business Logic**: 90%+ code coverage
- **ViewModels**: 80%+ code coverage
- **Data Layer**: 85%+ code coverage
- **Views**: UI tests cho critical flows (game setup, card reveal, game end)

### Integration Testing

**Critical Flows**:
1. Complete game flow: Setup → Card reveal → Play → End → Save
2. Location management: Create list → Add locations → Use in game
3. History and statistics: Play multiple games → View history → Check statistics
4. Data persistence: Save data → Kill app → Relaunch → Verify data loaded

### Performance Testing

**Benchmarks**:
- Game creation: < 100ms
- Card generation for 8 players: < 50ms
- Statistics calculation for 1000 games: < 500ms
- Core Data save operation: < 200ms
- Core Data fetch all games: < 300ms

### UI Testing

**Automated UI Tests** (using XCTest UI Testing):
1. Game setup flow
2. Card reveal sequence
3. Timer controls (pause/resume)
4. Vote and guess flows
5. Location list management
6. History browsing

**Manual Testing Checklist**:
- Dark mode appearance
- Landscape orientation
- Font sizes readable from distance
- Animation smoothness
- Accessibility features (VoiceOver, Dynamic Type)

### Test Data Generators

**For Property-Based Tests**, implement generators cho:

```swift
// Generate valid player counts
Gen<Int>.fromElements(in: 3...8)

// Generate location lists
Gen<LocationList>.compose { 
    LocationList(
        name: String.arbitrary,
        locations: Gen<[Location]>.sized { size in
            Gen<Location>.proliferate(withSize: max(1, size))
        }
    )
}

// Generate games
Gen<Game>.compose {
    let playerCount = Gen<Int>.fromElements(in: 3...8).generate
    let locationList = Gen<LocationList>.arbitrary.generate
    return gameEngine.createGame(playerCount: playerCount, locationList: locationList)
}
```

### Continuous Integration

**CI Pipeline**:
1. Run all unit tests
2. Run all property-based tests (100 iterations each)
3. Run integration tests
4. Generate code coverage report
5. Run UI tests on simulator
6. Fail build if coverage < 80% or any test fails

**Test Execution Time Target**: < 5 minutes for full suite
