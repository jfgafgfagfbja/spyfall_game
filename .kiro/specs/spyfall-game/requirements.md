# Requirements Document - Spyfall Game

## Introduction

Spyfall Game là một ứng dụng iOS native cho phép 3-8 người chơi tham gia trò chơi xã hội trực tiếp. Trong mỗi ván chơi, tất cả người chơi (trừ một Gián điệp) nhận được cùng một địa điểm bí mật. Gián điệp không biết địa điểm và phải cố gắng trà trộn trong khi đoán địa điểm. Người dân phải tìm ra Gián điệp thông qua việc đặt câu hỏi cho nhau.

## Glossary

- **Game**: Một ván chơi Spyfall hoàn chỉnh từ lúc phát thẻ đến khi kết thúc
- **Player**: Người tham gia vào Game
- **Spy**: Vai trò đặc biệt được gán ngẫu nhiên cho một Player, không biết Location
- **Civilian**: Vai trò của Player biết Location, phải tìm ra Spy
- **Location**: Địa điểm bí mật được gán cho tất cả Civilian trong một Game
- **Card**: Thông tin vai trò và Location hiển thị cho mỗi Player
- **Location_List**: Tập hợp các Location có thể được sử dụng trong Game
- **Game_History**: Bản ghi lưu trữ kết quả của các Game đã chơi
- **Timer**: Bộ đếm thời gian cho mỗi Game
- **Vote**: Hành động bỏ phiếu của Players để chọn ai là Spy
- **Guess**: Hành động của Spy đoán Location
- **System**: Ứng dụng Spyfall Game

## Requirements

### Requirement 1: Thiết lập Game

**User Story:** Là người tổ chức, tôi muốn thiết lập một ván chơi mới với số lượng người chơi và danh sách địa điểm, để bắt đầu một Game Spyfall.

#### Acceptance Criteria

1. WHEN người dùng tạo Game mới, THE System SHALL cho phép chọn số lượng Player từ 3 đến 8
2. WHEN người dùng tạo Game mới, THE System SHALL cho phép chọn Location_List (mặc định hoặc tùy chỉnh)
3. WHEN số lượng Player được chọn ngoài khoảng 3-8, THE System SHALL hiển thị thông báo lỗi và không cho phép tiếp tục
4. WHEN Location_List được chọn rỗng, THE System SHALL hiển thị thông báo lỗi và không cho phép tiếp tục
5. WHEN thiết lập hợp lệ được xác nhận, THE System SHALL chuyển sang màn hình phát Card

### Requirement 2: Phát thẻ cho người chơi

**User Story:** Là người chơi, tôi muốn xem Card của mình một cách bí mật trên cùng một thiết bị, để không ai khác biết vai trò của tôi.

#### Acceptance Criteria

1. WHEN Game bắt đầu, THE System SHALL chọn ngẫu nhiên một Player làm Spy
2. WHEN Game bắt đầu, THE System SHALL chọn ngẫu nhiên một Location từ Location_List đã chọn
3. WHEN phát Card, THE System SHALL hiển thị màn hình "Player N - Nhấn để xem thẻ" cho từng Player theo thứ tự
4. WHEN Player nhấn vào màn hình, THE System SHALL hiển thị Card với vai trò (Spy hoặc Civilian) và Location (nếu là Civilian)
5. WHEN Card đang hiển thị, THE System SHALL cung cấp nút "Đã xem xong" để chuyển sang Player tiếp theo
6. WHEN Player nhấn "Đã xem xong", THE System SHALL hiển thị màn hình chờ trước khi chuyển sang Player tiếp theo
7. WHEN tất cả Players đã xem Card, THE System SHALL bắt đầu Timer và chuyển sang màn hình chơi Game

### Requirement 3: Quản lý thời gian Game

**User Story:** Là người chơi, tôi muốn có bộ đếm thời gian trong Game, để biết còn bao nhiêu thời gian để chơi.

#### Acceptance Criteria

1. WHEN Game bắt đầu sau khi phát Card, THE System SHALL khởi động Timer với thời gian mặc định 8 phút
2. WHILE Timer đang chạy, THE System SHALL hiển thị thời gian còn lại trên màn hình
3. WHEN Timer hết giờ, THE System SHALL phát thông báo và chuyển sang màn hình kết thúc Game
4. WHEN người dùng tạm dừng Timer, THE System SHALL dừng đếm thời gian
5. WHEN người dùng tiếp tục Timer đã tạm dừng, THE System SHALL tiếp tục đếm từ thời gian còn lại

### Requirement 4: Kết thúc Game

**User Story:** Là người chơi, tôi muốn kết thúc Game bằng cách bỏ phiếu hoặc để Spy đoán địa điểm, để xác định ai thắng.

#### Acceptance Criteria

1. WHEN người dùng chọn "Bỏ phiếu", THE System SHALL hiển thị danh sách tất cả Players để chọn
2. WHEN người dùng chọn một Player trong bỏ phiếu, THE System SHALL hiển thị kết quả (đúng hay sai) dựa trên vai trò thực của Player đó
3. WHEN người dùng chọn "Spy đoán địa điểm", THE System SHALL hiển thị danh sách tất cả Locations từ Location_List đã chọn
4. WHEN Spy chọn một Location, THE System SHALL hiển thị kết quả (đúng hay sai) dựa trên Location thực của Game
5. WHEN kết quả được hiển thị, THE System SHALL cho phép lưu Game vào Game_History
6. WHEN kết quả được hiển thị, THE System SHALL hiển thị Location thực và vai trò của tất cả Players

### Requirement 5: Quản lý danh sách địa điểm

**User Story:** Là người dùng, tôi muốn tạo và quản lý các Location_List tùy chỉnh, để có thể chơi với các địa điểm phù hợp với nhóm của tôi.

#### Acceptance Criteria

1. THE System SHALL cung cấp một Location_List mặc định với ít nhất 20 Locations
2. WHEN người dùng tạo Location_List mới, THE System SHALL cho phép đặt tên cho Location_List
3. WHEN người dùng thêm Location vào Location_List, THE System SHALL lưu Location với tên duy nhất trong Location_List đó
4. WHEN người dùng thêm Location trùng tên trong cùng Location_List, THE System SHALL hiển thị thông báo lỗi và không cho phép thêm
5. WHEN người dùng sửa Location, THE System SHALL cập nhật tên Location trong Location_List
6. WHEN người dùng xóa Location, THE System SHALL xóa Location khỏi Location_List
7. WHEN Location_List có ít hơn 10 Locations, THE System SHALL hiển thị cảnh báo nhưng vẫn cho phép sử dụng
8. WHEN người dùng xóa Location_List, THE System SHALL xóa Location_List và tất cả Locations trong đó

### Requirement 6: Lưu trữ lịch sử Game

**User Story:** Là người dùng, tôi muốn lưu lại kết quả các ván chơi, để có thể xem lại sau này.

#### Acceptance Criteria

1. WHEN Game kết thúc và người dùng chọn lưu, THE System SHALL lưu thông tin Game vào Game_History
2. WHEN lưu Game, THE System SHALL lưu các thông tin: ngày giờ, số lượng Players, Location, vai trò thắng (Spy hoặc Civilian), thời gian chơi
3. WHEN người dùng xem Game_History, THE System SHALL hiển thị danh sách các Games đã lưu theo thứ tự thời gian giảm dần
4. WHEN người dùng chọn một Game trong Game_History, THE System SHALL hiển thị chi tiết đầy đủ của Game đó
5. WHEN người dùng xóa một Game từ Game_History, THE System SHALL xóa Game đó khỏi lưu trữ

### Requirement 7: Thống kê

**User Story:** Là người dùng, tôi muốn xem thống kê về các ván chơi, để biết xu hướng và hiệu suất của các vai trò.

#### Acceptance Criteria

1. WHEN người dùng xem thống kê, THE System SHALL hiển thị tổng số Games đã chơi
2. WHEN người dùng xem thống kê, THE System SHALL hiển thị số lần Spy thắng và tỷ lệ phần trăm
3. WHEN người dùng xem thống kê, THE System SHALL hiển thị số lần Civilian thắng và tỷ lệ phần trăm
4. WHEN người dùng xem thống kê, THE System SHALL hiển thị danh sách Locations được chơi nhiều nhất với số lần xuất hiện
5. WHEN người dùng xem thống kê, THE System SHALL hiển thị thời gian chơi trung bình
6. WHEN không có dữ liệu trong Game_History, THE System SHALL hiển thị thông báo "Chưa có dữ liệu"

### Requirement 8: Lưu trữ dữ liệu local

**User Story:** Là người dùng, tôi muốn dữ liệu của tôi được lưu trữ trên thiết bị, để có thể sử dụng ứng dụng offline và bảo mật dữ liệu cá nhân.

#### Acceptance Criteria

1. WHEN người dùng tạo hoặc sửa Location_List, THE System SHALL lưu trữ dữ liệu vào Core Data
2. WHEN người dùng lưu Game vào Game_History, THE System SHALL lưu trữ dữ liệu vào Core Data
3. WHEN ứng dụng khởi động, THE System SHALL tải tất cả dữ liệu từ Core Data
4. WHEN dữ liệu Core Data bị lỗi, THE System SHALL hiển thị thông báo lỗi và khởi tạo dữ liệu mặc định
5. FOR ALL thao tác ghi dữ liệu, THE System SHALL đảm bảo tính toàn vẹn dữ liệu trước khi commit

### Requirement 9: Giao diện người dùng

**User Story:** Là người dùng, tôi muốn giao diện ứng dụng dễ sử dụng và phù hợp với iOS, để có trải nghiệm tốt khi chơi.

#### Acceptance Criteria

1. THE System SHALL sử dụng SwiftUI cho tất cả các màn hình
2. THE System SHALL tuân thủ iOS Human Interface Guidelines
3. WHEN hiển thị Card, THE System SHALL sử dụng font size đủ lớn để dễ đọc từ xa
4. WHEN chuyển giữa các màn hình, THE System SHALL sử dụng animations mượt mà
5. THE System SHALL hỗ trợ cả chế độ portrait và landscape
6. THE System SHALL hỗ trợ Dark Mode và Light Mode
