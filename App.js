import React from 'react';
import { StyleSheet } from 'react-native';
import Chart from './components/Chart';
import Note from './components/Note';
import FrontPage from './components/FrontPage';
import NewNote from './components/NewNote';
import EditNote from './components/EditNote';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from './components/LoadingScreen';

const Tab = createBottomTabNavigator();

function BottomNavigator() {
  const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
        let iconName;
    
        if (route.name === 'FrontPage') {
            iconName = 'md-home';
        } else if (route.name === 'Chart') {
            iconName = 'ios-pie-chart';
        } else if (route.name === 'NewNote') {
            iconName = 'create';
        }
    
        return <Ionicons name={iconName} size={size} color={color} />;
        }
  });

  

  return (
    
        <Tab.Navigator screenOptions = { screenOptions }>
            <Tab.Screen name='FrontPage' component={ FrontPage } options={{ title: 'Home' }}/>
            <Tab.Screen name='Chart' component={ Chart } options={{ title: 'Chart' }}/>
            <Tab.Screen name='NewNote' component={ NewNote } options={{ title: 'Add' }}/>
        </Tab.Navigator>
    
  );
}

const Stack = createStackNavigator();

export default function App() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="LoadingScreen" component={LoadingScreen} />
                <Stack.Screen options={{headerShown: false}} name='BottomNavigator' component={BottomNavigator}/>
                <Stack.Screen options={{headerShown: false}} name='Note' component={Note}/>
                <Stack.Screen options={{headerShown: false}} name='EditNote' component={EditNote}/>
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
