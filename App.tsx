import React from 'react';
import {StatusBar} from 'react-native';
import {GameProvider} from './src/context/GameContext';
import {LocationProvider} from './src/context/LocationContext';
import {HistoryProvider} from './src/context/HistoryContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <GameProvider>
      <LocationProvider>
        <HistoryProvider>
          <StatusBar barStyle="dark-content" />
          <AppNavigator />
        </HistoryProvider>
      </LocationProvider>
    </GameProvider>
  );
}

export default App;
