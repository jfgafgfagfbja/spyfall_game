import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useGame} from '../context/GameContext';
import {GameWinner} from '../types';

interface GameResultProps {
  navigation: any;
  route: any;
}

const GameResult: React.FC<GameResultProps> = ({navigation, route}) => {
  const {result} = route.params;
  const {currentGame, saveGame, resetGame} = useGame();

  if (!currentGame) {
    return null;
  }

  const handleSaveGame = async () => {
    try {
      await saveGame();
      Alert.alert('Thành công', 'Game đã được lưu!', [
        {text: 'OK', onPress: () => handlePlayAgain()},
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('GameSetup');
  };

  const isSpyWin = result.winner === GameWinner.Spy;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.resultCard, isSpyWin ? styles.spyWin : styles.civilianWin]}>
          <Text style={styles.resultEmoji}>{isSpyWin ? '🕵️' : '👥'}</Text>
          <Text style={styles.resultText}>
            {isSpyWin
              ? 'GIÁN ĐIỆP (NỘI GIÁN) THẮNG!'
              : 'DÂN THƯỜNG (THƯỜNG DÂN) THẮNG!'}
          </Text>
          <Text style={styles.resultSubtext}>
            {result.isCorrect ? '✅ Đúng rồi!' : '❌ Sai rồi!'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Thông tin game</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gián điệp (Nội gián):</Text>
            <Text style={styles.infoValue}>
              {currentGame.playerNames[result.actualSpyIndex] ||
                `Người chơi ${result.actualSpyIndex + 1}`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian chơi:</Text>
            <Text style={styles.infoValue}>
              {Math.floor(currentGame.duration / 60)} phút {Math.floor(currentGame.duration % 60)} giây
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveGame}>
          <Text style={styles.saveButtonText}>💾 Lưu game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainButtonText}>🔄 Chơi lại</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  resultCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  spyWin: {
    backgroundColor: '#FF3B30',
  },
  civilianWin: {
    backgroundColor: '#34C759',
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  resultSubtext: {
    fontSize: 24,
    color: '#FFF',
    opacity: 0.9,
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playAgainButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameResult;
