import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native';
import Slider from '@react-native-community/slider';
import Firebase from '../config/Firebase';
import Checkbox from 'expo-checkbox';

export default function NewNote({ navigation }) {

    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sadValue, setSadValue] = useState(0);
    const [happyValue, setHappyValue] = useState(0);
    const [angryValue, setAngryValue] = useState(0);
    const [isChecked, setChecked] = useState(true);

    const saveNote = async () => {
      let key = getKey(); //database entry/node key for this note
      
      try {
        await Firebase.database().ref('notes/' + key).set(
          {
            key: key,
            title: title,
            body: body,
            dateString: (new Date()).toString(), //db does not accept date as is but as String
            timestamp: Date.now(),
            sadness: sadValue,
            happiness: happyValue,
            angriness: angryValue
          }
        )
        .then(Alert.alert('Your note was saved.'));
        clearFields();
        navigation.navigate('FrontPage');
      } catch (error) {
        setMsg('Error in saving note ' + error);
        console.log(msg);
      }
    }

    const clearFields = () => {
      setMsg('');
      setTitle('');
      setBody('');
      setSadValue(0);
      setHappyValue(0);
      setAngryValue(0);
    }

    const getKey = () => {
      return Firebase.database().ref('notes/').push().getKey();
    }

    const interpret = (emotion, value) => {
      const adjectives = ['neutral', 'slightly', 'somewhat', 'very', 'extremely'];
      if (value === 'undocumented') {
        return 'Do not document my emotions.'
      }
      if (value === 0) {
        return 'neutral';
      } else {
        return adjectives[value] + ' ' + emotion;
      }
    }

    const documentEmotions = () => {
      if (!isChecked) {
        setSadValue('undocumented'); // db does not accept undefined
        setAngryValue('undocumented');
        setHappyValue('undocumented');
      } else {
        setSadValue(0);
        setAngryValue(0);
        setHappyValue(0);
      }
    }

    useEffect(() => {
      documentEmotions();
    }, [isChecked]);

  return (
    
    <View style={styles.container}>
            <Text style={styles.heading}>Create new note</Text>
            <TextInput
                autoFocus
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder='Note title'
            />
            <TextInput
                multiline
                numberOfLines={4}
                scrollEnabled
                style={styles.input}
                onChangeText={setBody}
                value={body}
                placeholder='Description'
            />
              <View style= {styles.headingPicker}><Text style={styles.heading}>Basic emotions</Text>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#4630EB' : undefined}
                />
              </View>
              <View style= {styles.sliders}>
                <View><Text>Sadness: {interpret('sad', sadValue)}</Text></View>
                <Slider
                  style={{width: 250, height: 60}}
                  minimumValue={0}
                  maximumValue={4}
                  minimumTrackTintColor="#071ff2"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#071ff2"
                  step={1}
                  value={sadValue}
                  onValueChange={setSadValue}
                  onSlidingComplete={setSadValue}
                  vertical
                  disabled={!isChecked}              
                />
                <View><Text>Happiness: {interpret('happy', happyValue)}</Text></View>
                <Slider
                  style={{width: 250, height: 60}}
                  minimumValue={0}
                  maximumValue={4}
                  minimumTrackTintColor="#f7f305"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#f7f305"
                  step={1}
                  value={happyValue}
                  onValueChange={setHappyValue}
                  onSlidingComplete={setHappyValue}
                  vertical
                  disabled={!isChecked}              
                />
                <View><Text>Angriness: {interpret('angry', angryValue)}</Text></View>
                <Slider
                  style={{width: 250, height: 60}}
                  minimumValue={0}
                  maximumValue={4}
                  minimumTrackTintColor="#f70505"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#f70505"
                  step={1}
                  value={angryValue}
                  onValueChange={setAngryValue}
                  onSlidingComplete={setAngryValue}
                  vertical
                  disabled={!isChecked}              
                />
                </View>
            <Button 
              onPress={saveNote}
              title='Save'
            />
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
  input: {
    fontSize: 15,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  sliders: {
    flexDirection: 'column'
  },
  headingPicker: {
    flexDirection: 'row',
  }
});