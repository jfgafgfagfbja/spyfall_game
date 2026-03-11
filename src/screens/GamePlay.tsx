import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useGame} from '../context/GameContext';

interface GamePlayProps {
  navigation: any;
}

const GamePlay: React.FC<GamePlayProps> = ({navigation}) => {
  const {timeRemaining, isTimerPaused, pauseTimer, resumeTimer} = useGame();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndGame = () => {
    navigation.navigate('GameEnd');
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Thời gian còn lại</Text>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={isTimerPaused ? resumeTimer : pauseTimer}>
          <Text style={styles.controlButtonText}>
            {isTimerPaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endButton]}
          onPress={handleEndGame}>
          <Text style={styles.controlButtonText}>Kết thúc game</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Cách chơi:</Text>
        <Text style={styles.instructionText}>
          • Dân thường: Đặt câu hỏi để tìm ra Gián điệp{'\n'}
          • Gián điệp: Trả lời câu hỏi để không bị phát hiện{'\n'}
          • Đừng hỏi quá rõ ràng hoặc quá mơ hồ!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  timerContainer: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timerLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  controls: {
    gap: 15,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 40,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default GamePlay;
