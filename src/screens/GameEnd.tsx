import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useGame} from '../context/GameContext';

interface GameEndProps {
  navigation: any;
}

const GameEnd: React.FC<GameEndProps> = ({navigation}) => {
  const {currentGame, endGameWithVote} = useGame();

  if (!currentGame) {
    return null;
  }

  const handleVote = (playerIndex: number) => {
    const result = endGameWithVote(playerIndex);
    navigation.navigate('GameResult', {result});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ai là Gián điệp?</Text>
      <FlatList
        data={Array.from({length: currentGame.playerCount}, (_, i) => i)}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleVote(item)}>
            <Text style={styles.listItemText}>
              {currentGame.playerNames[item] || `Người chơi ${item + 1}`}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GameEnd;
