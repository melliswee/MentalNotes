import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Greeting from './components/Greeting';
import Note from './components/Note';
import FrontPage from './components/FrontPage';
import NewNote from './components/NewNote';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomNavigator() {
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

  

  return (
    
        <Tab.Navigator screenOptions = { screenOptions }>
            <Tab.Screen name='FrontPage' component={ FrontPage } options={{ title: 'Home' }}/>
            <Tab.Screen name='Greeting' component={ Greeting } options={{ title: 'Hello' }}/>
            <Tab.Screen name='NewNote' component={ NewNote } options={{ title: 'Add' }}/>
        </Tab.Navigator>
    
  );
}

const Stack = createStackNavigator();

export default function App() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{headerShown: false}} name='BottomNavigator' component={BottomNavigator}/>
                <Stack.Screen options={{headerShown: false}} name='Note' component={Note}/>
            </Stack.Navigator>
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
