import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Greeting from './components/Greeting';
import FrontPage from './components/FrontPage';
import NewNote from './components/NewNote';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
  
      if (route.name === 'FrontPage') {
        iconName = 'md-home';
      } else if (route.name === 'Greeting') {
        iconName = 'hand-right-outline';
      } else if (route.name === 'NewNote') {
        iconName = 'create';
      }
  
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions = { screenOptions }>
        <Tab.Screen name='FrontPage' component={ FrontPage } options={{ title: 'Home' }}/>
        <Tab.Screen name='Greeting' component={ Greeting } options={{ title: 'Hello' }}/>
        <Tab.Screen name='NewNote' component={ NewNote } options={{ title: 'Add' }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    flex: 2,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
