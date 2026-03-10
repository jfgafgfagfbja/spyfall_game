import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useHistory} from '../context/HistoryContext';

const Statistics: React.FC = () => {
  const {statistics, loading} = useHistory();

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Đang tải...</Text>
      </View>
    );
  }

  if (!statistics || statistics.totalGames === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📈</Text>
        <Text style={styles.emptyText}>Chưa có dữ liệu thống kê</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tổng quan</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tổng số game:</Text>
          <Text style={styles.statValue}>{statistics.totalGames}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Thời gian trung bình:</Text>
          <Text style={styles.statValue}>
            {Math.floor(statistics.averageDuration / 60)} phút
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tỷ lệ thắng</Text>
        <View style={styles.winRateContainer}>
          <View style={styles.winRateItem}>
            <Text style={styles.winRateEmoji}>🕵️</Text>
            <Text style={styles.winRateLabel}>Gián điệp</Text>
            <Text style={styles.winRateValue}>
              {statistics.spyWins} / {statistics.totalGames}
            </Text>
            <Text style={styles.winRatePercent}>
              {statistics.spyWinRate.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.winRateItem}>
            <Text style={styles.winRateEmoji}>👥</Text>
            <Text style={styles.winRateLabel}>Dân thường</Text>
            <Text style={styles.winRateValue}>
              {statistics.civilianWins} / {statistics.totalGames}
            </Text>
            <Text style={styles.winRatePercent}>
              {statistics.civilianWinRate.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
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
  card: {
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  winRateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  winRateItem: {
    alignItems: 'center',
    flex: 1,
  },
  winRateEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  winRateLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  winRateValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  winRatePercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default Statistics;
