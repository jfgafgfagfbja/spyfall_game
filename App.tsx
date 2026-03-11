import React from 'react';
import {StatusBar} from 'react-native';
import {GameProvider} from './src/context/GameContext';
import {HistoryProvider} from './src/context/HistoryContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <GameProvider>
      <HistoryProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </HistoryProvider>
    </GameProvider>
  );
}

export default App;
