import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import Firebase from '../config/Firebase';
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewNote({ navigation }) {

    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sadValue, setSadValue] = useState(0);
    const [happyValue, setHappyValue] = useState(0);
    const [anxiousValue, setAnxiousValue] = useState(0);
    const [otherEmotions, setOtherEmotions] = useState(
        {
        'shame': false, 
        'fear': false, 
        'trust': false, 
        'disgust': false, 
        'anger': false, 
        'surprise': false
        });
    const [basicIsChecked, setBasicChecked] = useState(true);
    const [otherIsChecked, setOtherChecked] = useState(true);

    const saveNote = async () => {
        let key = getKey(); //database entry/node key for this note
        let date = new Date();
      
        try {
            await Firebase.database().ref('notes/' + key).set(
            {
                key: key,
                title: title,
                body: body,
                dateString: formatDate(), //db does not accept date as is but as a String
                dayOfTheWeek: date.getDay(),
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                time: date.toTimeString(),
                timestamp: Date.now(),
                mood: {
                sadness: sadValue,
                happiness: happyValue,
                anxiety: anxiousValue,
                },
                otherEmotions: {
                    shame: otherEmotions.shame,
                    fear: otherEmotions.fear,
                    trust: otherEmotions.trust,
                    disgust: otherEmotions.disgust,
                    anger: otherEmotions.anger,
                    surprise: otherEmotions.surprise
                }
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

    const formatDate = () => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();  
    }

    const clearFields = () => {
        setMsg('');
        setTitle('');
        setBody('');
        setSadValue(0);
        setHappyValue(0);
        setAnxiousValue(0);
        setOtherEmotions({'shame': false, 'fear': false, 'trust': false, 'disgust': false, 'anger': false, 'surprise': false});
        setBasicChecked(true);
        setOtherChecked(true);
    }

    const getKey = () => {
        return Firebase.database().ref('notes/').push().getKey();
    }

    // describes slider number with words, takes emotion word (like 'sad') and slider value
    const interpret = (emotion, value) => {
        const adjectives = ['neutral', 'slightly', 'somewhat', 'very', 'extremely'];
        if (value === 'undocumented') {
            return 'undocumented'
        }
        if (value === 0) {
            return 'neutral';
        } else {
            return adjectives[value] + ' ' + emotion;
        }
    }

    // if user does not want to document their emotions in this note, set emotions to 'undocumented'
    const documentEmotions = () => {
        if (!basicIsChecked) {
            setSadValue('undocumented'); // db does not accept undefined
            setAnxiousValue('undocumented');
            setHappyValue('undocumented');
        } else {
            setSadValue(0);
            setAnxiousValue(0);
            setHappyValue(0);
        }
    }

    const documentOtherEmotions = () => {
        if (!otherIsChecked) {
            setOtherEmotions({'shame': 'undocumented', 'fear': 'undocumented', 'trust': 'undocumented', 'disgust': 'undocumented', 'anger': 'undocumented', 'surprise': 'undocumented'});
        } else {
            setOtherEmotions({'shame': false, 'fear': false, 'trust': false, 'disgust': false, 'anger': false, 'surprise': false});
        }
    }

    // huom: yritetty tehdä asetus näin: setOtherEmotions({...otherEmotions, [e.target.name]: e.target.value}), mutta ei onnistunut
    const handleOtherEmotion = (e, emotion) => {
        let name = emotion;
        setOtherEmotions({...otherEmotions, [name]: e});
    }

    const handleCancel = () => {
        clearFields();
        navigation.navigate('FrontPage');
    }

    // if basic emotion's checkbox' state is changed, change the emotion states
    useEffect(() => {
        documentEmotions();
    }, [basicIsChecked]);

    useEffect(() => {
        documentOtherEmotions();
      }, [otherIsChecked]);

  return (
    <View style={styles.container}>
    <SafeAreaView style={styles.container}>
        <ScrollView style= {styles.safeareaView}>
        <View style={styles.headingContainer}>
            <Text style={styles.heading1}>Create a new note</Text>
        </View>
       <View style={styles.headingContainer}>
            <Text style={styles.heading2}>{formatDate()}</Text>
        </View>
        
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder='Note title'
            />
            <TextInput
                multiline={true}
                numberOfLines={4}
                scrollEnabled={true}
                style={styles.input}
                onChangeText={setBody}
                value={body}
                placeholder='My notes'
            />
        </View>
        <View name ='emotionsHeader' style= {styles.headingPicker}><Text style={styles.heading2}>Basic mood</Text>
            <Checkbox
              value={basicIsChecked}
              onValueChange={setBasicChecked}
              color={basicIsChecked ? '#4630EB' : undefined}
              />
        </View>
        <View style= {styles.sliders}>
              <View style={styles.text}><Text>Sadness: {interpret('sad', sadValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={4}
                    minimumTrackTintColor="#071ff2"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#071ff2"
                    step={1}
                    value={sadValue}
                    onValueChange={setSadValue}
                    onSlidingComplete={setSadValue}
                    disabled={!basicIsChecked}              
                />
              </View>
              <View style={styles.text}><Text>Happiness: {interpret('happy', happyValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={4}
                    minimumTrackTintColor="#20c40a"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#20c40a"
                    step={1}
                    value={happyValue}
                    onValueChange={setHappyValue}
                    onSlidingComplete={setHappyValue}
                    disabled={!basicIsChecked}              
                />
              </View>
              <View style={styles.text}><Text>Anxiety: {interpret('anxious', anxiousValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={4}
                    minimumTrackTintColor="#f70505"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#f70505"
                    step={1}
                    value={anxiousValue}
                    onValueChange={setAnxiousValue}
                    onSlidingComplete={setAnxiousValue}
                    disabled={!basicIsChecked}              
                />
              </View>
        </View>
        <View name ='otherEmotionsHeader' style= {styles.headingPicker}><Text style={styles.heading2}>Other emotions</Text>
            <Checkbox
              value={otherIsChecked}
              onValueChange={setOtherChecked}
              color={otherIsChecked ? '#4630EB' : undefined}
              />
        </View>
        <View style={styles.pickers}>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='anger'
                value={otherEmotions.anger}
                onValueChange={(e) => handleOtherEmotion(e, 'anger')}
                color={otherIsChecked ? '#f70505' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Anger</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='shame'
                value={otherEmotions.shame}
                onValueChange={(e) => handleOtherEmotion(e, 'shame')}
                color={otherIsChecked ? '#b30b9f' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Shame</Text>
            </View>
        </View>
        <View style={styles.pickers}>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='fear'
                value={otherEmotions.fear}
                onValueChange={(e) => handleOtherEmotion(e, 'fear')}
                color={otherIsChecked ? '#0f0f0f' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Fear</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='trust'
                value={otherEmotions.trust}
                onValueChange={(e) => handleOtherEmotion(e, 'trust')}
                color={otherIsChecked ? '#e39414' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Trust</Text>
            </View>
        </View>
        <View style={styles.pickers}>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='disgust'
                value={otherEmotions.disgust}
                onValueChange={(e) => handleOtherEmotion(e, 'disgust')}
                color={otherIsChecked ? '#046120' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Disgust</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='surprise'
                value={otherEmotions.surprise}
                onValueChange={(e) => handleOtherEmotion(e, 'surprise')}
                color={otherIsChecked ? '#faf20a' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Surprise</Text>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <Button
                onPress={saveNote}
                title='Save'
                color= '#4630EB'
            />
            <Button 
              onPress={handleCancel}
              title='Cancel'
              color= '#f70505'
            />
        </View>
        </ScrollView>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
    },
    inputContainer: {
        flex: 2,
        width: '100%'
    },
    input: {
        flex: 1,
        fontSize: 15,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10,
    },
    heading1: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    headingContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: '5%'
    },
        sliders: {
        flex: 2,
        width: '100%'
    },
    slider: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    headingPicker: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '5%'
    },
    otherPicker: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: '5%',
        marginHorizontal: '10%'
    },
    pickerText: {
        fontSize: 16,
    },
    text: {
        fontSize: 12,
    },
    safeareaView: {
        marginHorizontal: 20
     },
    pickers: {
        flex: 2,
        flexDirection: 'row'
    }
});