import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
import GameSetup from '../screens/GameSetup';
import CardReveal from '../screens/CardReveal';
import GamePlay from '../screens/GamePlay';
import GameEnd from '../screens/GameEnd';
import GameResult from '../screens/GameResult';
import LocationListSelection from '../screens/LocationListSelection';
import LocationManagement from '../screens/LocationManagement';
import LocationListDetail from '../screens/LocationListDetail';
import History from '../screens/History';
import Statistics from '../screens/Statistics';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GameStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GameSetup" 
        component={GameSetup}
        options={{title: 'Game Mới'}}
      />
      <Stack.Screen 
        name="LocationListSelection" 
        component={LocationListSelection}
        options={{title: 'Chọn Danh Sách'}}
      />
      <Stack.Screen
        name="LocationManagement"
        component={LocationManagement}
        options={{title: 'Quản Lý Danh Sách'}}
      />
      <Stack.Screen
        name="LocationListDetail"
        component={LocationListDetail}
        options={({route}: any) => ({
          title: (route.params as any)?.listName || 'Chi Tiết Danh Sách',
        })}
      />
      <Stack.Screen 
        name="CardReveal" 
        component={CardReveal}
        options={{title: 'Phát Thẻ', headerShown: false}}
      />
      <Stack.Screen 
        name="GamePlay" 
        component={GamePlay}
        options={{title: 'Đang Chơi'}}
      />
      <Stack.Screen 
        name="GameEnd" 
        component={GameEnd}
        options={{title: 'Kết Thúc'}}
      />
      <Stack.Screen 
        name="GameResult" 
        component={GameResult}
        options={{title: 'Kết Quả'}}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
        }}>
        <Tab.Screen 
          name="Game" 
          component={GameStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Game Mới',
            tabBarIcon: ({color}) => <span style={{fontSize: 24}}>🎮</span>,
          }}
        />
        <Tab.Screen 
          name="History" 
          component={History}
          options={{
            title: 'Lịch Sử',
            tabBarLabel: 'Lịch Sử',
            tabBarIcon: ({color}) => <span style={{fontSize: 24}}>📊</span>,
          }}
        />
        <Tab.Screen 
          name="Statistics" 
          component={Statistics}
          options={{
            title: 'Thống Kê',
            tabBarLabel: 'Thống Kê',
            tabBarIcon: ({color}) => <span style={{fontSize: 24}}>📈</span>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
