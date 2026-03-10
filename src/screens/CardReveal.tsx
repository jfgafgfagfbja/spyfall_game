import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useGame} from '../context/GameContext';
import {PlayerCard} from '../types';

interface CardRevealProps {
  navigation: any;
}

const CardReveal: React.FC<CardRevealProps> = ({navigation}) => {
  const {currentGame, currentPlayerIndex, setCurrentPlayerIndex, revealCard, startGame} = useGame();
  const [isRevealed, setIsRevealed] = useState(false);
  const [card, setCard] = useState<PlayerCard | null>(null);

  if (!currentGame) {
    return null;
  }

  const currentPlayerName =
    currentGame.playerNames[currentPlayerIndex] ||
    `Người chơi ${currentPlayerIndex + 1}`;

  const handleReveal = () => {
    const playerCard = revealCard(currentPlayerIndex);
    setCard(playerCard);
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (currentPlayerIndex < currentGame.playerCount - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsRevealed(false);
      setCard(null);
    } else {
      startGame();
      navigation.navigate('GamePlay');
    }
  };

  return (
    <View style={styles.container}>
      {!isRevealed ? (
        <TouchableOpacity style={styles.revealContainer} onPress={handleReveal}>
          <Text style={styles.playerNumber}>{currentPlayerName}</Text>
          <Text style={styles.instruction}>Nhấn để xem thẻ</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.playerNumber}>{currentPlayerName}</Text>
          
          <View style={[styles.card, card?.role === 'spy' ? styles.spyCard : styles.civilianCard]}>
            <Text style={styles.roleText}>
              {card?.role === 'spy'
                ? '🕵️ GIÁN ĐIỆP (NỘI GIÁN)'
                : '👥 DÂN THƯỜNG (THƯỜNG DÂN)'}
            </Text>
            
            {card?.role === 'civilian' && (
              <View style={styles.locationContainer}>
                <Text style={styles.wordLabel}>Từ của dân thường:</Text>
                <Text style={styles.wordText}>{card.civilianWord}</Text>
              </View>
            )}
            
            {card?.role === 'spy' && (
              <Text style={styles.spyHint}>
                Từ của gián điệp: {card.spyClue}{'\n'}
                Chúc may mắn
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPlayerIndex < currentGame.playerCount - 1 ? 'Đã xem xong' : 'Bắt đầu chơi'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  revealContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  playerNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 24,
    color: '#AAA',
  },
  card: {
    width: '100%',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 30,
  },
  spyCard: {
    backgroundColor: '#FF3B30',
  },
  civilianCard: {
    backgroundColor: '#34C759',
  },
  roleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  wordLabel: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 18,
    marginBottom: 6,
  },
  wordText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  spyHint: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CardReveal;
