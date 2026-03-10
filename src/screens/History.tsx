import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {useHistory} from '../context/HistoryContext';
import {GameWinner} from '../types';

const History: React.FC = () => {
  const {games, loading, deleteGame} = useHistory();

  const handleDelete = (gameId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa game này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGame(gameId);
            } catch (error: any) {
              Alert.alert('Lỗi', error.message);
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Đang tải...</Text>
      </View>
    );
  }

  if (games.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyText}>Chưa có lịch sử game</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.gameCard}>
            <View style={styles.gameHeader}>
              <Text style={styles.gameDate}>{formatDate(item.startTime)}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gameInfo}>
              <Text style={styles.players}>👥 {item.playerCount} người chơi</Text>
              <Text style={styles.duration}>
                ⏱️ {Math.floor(item.duration / 60)} phút
              </Text>
              <Text style={styles.spyInfo}>
                🕵️ {item.playerNames[item.spyIndex] || `Người chơi ${item.spyIndex + 1}`}
              </Text>
            </View>

            <View style={[
              styles.winnerBadge,
              item.winner === GameWinner.Spy ? styles.spyWin : styles.civilianWin,
            ]}>
              <Text style={styles.winnerText}>
                {item.winner === GameWinner.Spy
                  ? '🕵️ Gián điệp (Nội gián) thắng'
                  : '👥 Dân thường (Thường dân) thắng'}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  gameCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameDate: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    fontSize: 20,
  },
  gameInfo: {
    marginBottom: 15,
  },
  players: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#666',
  },
  spyInfo: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  winnerBadge: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  spyWin: {
    backgroundColor: '#FFE5E5',
  },
  civilianWin: {
    backgroundColor: '#E5F5E5',
  },
  winnerText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default History;
