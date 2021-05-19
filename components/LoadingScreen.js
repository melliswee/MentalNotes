import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function LoadingScreen({navigation}) {

    useEffect(() => {
        async function prepare() {
            try {
                // setting a manual wait time for 2 sec
                await new Promise(resolve => setTimeout(resolve, 2000));
                await SplashScreen.hideAsync();
            } catch (e) {
                console.warn(e);
            } finally {
                navigation.navigate('BottomNavigator');
            }
        }
        prepare();
    }, []);

  return (
    <View style={styles.container}>
        <ImageBackground source={require('../assets/splash.png')} style={{ width: '100%', height: '100%' }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});