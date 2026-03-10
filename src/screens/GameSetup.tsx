import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import {useGame} from '../context/GameContext';

interface GameSetupProps {
  navigation: any;
}

const GameSetup: React.FC<GameSetupProps> = ({navigation}) => {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({length: 5}, (_, index) => `Người chơi ${index + 1}`),
  );
  const {setupGame} = useGame();


  useEffect(() => {
    setPlayerNames(prev =>
      Array.from(
        {length: playerCount},
        (_, index) => prev[index] ?? `Người chơi ${index + 1}`,
      ),
    );
  }, [playerCount]);

  const handleChangePlayerName = (index: number, value: string) => {
    setPlayerNames(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleStartGame = () => {
    try {
      const normalizedPlayerNames = playerNames.map((name, index) => {
        const trimmed = name.trim();
        return trimmed.length > 0 ? trimmed : `Người chơi ${index + 1}`;
      });

      setupGame(
        playerCount,
        {id: 'word-pairs', name: 'Word Pairs', locations: [], isDefault: true},
        normalizedPlayerNames,
      );
      navigation.navigate('CardReveal');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thiết lập Game</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Số người chơi</Text>
          <View style={styles.playerCountContainer}>
            {[3, 4, 5, 6, 7, 8].map(count => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.playerButton,
                  playerCount === count && styles.playerButtonActive,
                ]}
                onPress={() => setPlayerCount(count)}>
                <Text
                  style={[
                    styles.playerButtonText,
                    playerCount === count && styles.playerButtonTextActive,
                  ]}>
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tên người chơi</Text>
          {Array.from({length: playerCount}, (_, index) => (
            <View key={index} style={styles.playerNameRow}>
              <Text style={styles.playerNameLabel}>Người chơi {index + 1}</Text>
              <TextInput
                style={styles.playerNameInput}
                value={playerNames[index]}
                onChangeText={text => handleChangePlayerName(index, text)}
                placeholder={`Nhập tên người chơi ${index + 1}`}
                placeholderTextColor="#999"
                maxLength={30}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Bắt đầu</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  playerCountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  playerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  playerButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  playerButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  playerButtonTextActive: {
    color: '#FFF',
  },
  playerNameRow: {
    marginBottom: 10,
  },
  playerNameLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  playerNameInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  startButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameSetup;
