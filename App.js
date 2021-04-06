import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Greeting from './components/Greeting';
import Firebase from './config/Firebase';

export default function App() {

  const saveMsg = async () => {
    try {
      await Firebase.database().ref('messages/').push(
        {
          title: 'Greetings',
          body: 'This is a test message 2'
        }
      )
      .then(Alert.alert('Message saved!'))
    } catch (error) {
      console.log('Error in saving message ' + error)
    }
  }

  return (
    <View style={styles.container}>
    <View style={styles.greeting}>
      <Greeting name= 'Mellu'/>
      <Button 
        onPress={saveMsg}
        title='Send msg to db'
      />
    </View>
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
    </View>
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
