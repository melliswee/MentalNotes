import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Firebase from '../config/Firebase';
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

export default function NewNote({ navigation, route }) {

    const note = route.params;

    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState(note.title);
    const [body, setBody] = useState(note.body);
    const [sadValue, setSadValue] = useState(note.mood.sadness);
    const [happyValue, setHappyValue] = useState(note.mood.happiness);
    const [anxiousValue, setAnxiousValue] = useState(note.mood.anxiety);
    const [otherEmotions, setOtherEmotions] = useState(
        {
        'shame': Boolean(note.otherEmotions.shame), 
        'fear': Boolean(note.otherEmotions.fear), 
        'trust': Boolean(note.otherEmotions.trust), 
        'disgust': Boolean(note.otherEmotions.disgust), 
        'anger': Boolean(note.otherEmotions.anger), 
        'surprise': Boolean(note.otherEmotions.surprise)
        });

    
    const getNote = async(key) => {
        try {
            await Firebase.database()
            .ref('/notes/' + key)
            .on('value', snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setNote(data);
                }
            });
        } catch (error) {
            console.log("Error fetching note " + error);
        }
    }

    const saveEdit = async () => {
        const key = note.key; //database entry/node key for this note
        try {
            await Firebase.database().ref('notes/' + key).update(
            {
                title: title,
                body: body,
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
        .then(Alert.alert('Your edits were saved.'))
        navigation.navigate('FrontPage');
        } catch (error) {
            setMsg('Error in saving edited note ' + error);
            console.log(msg);
        }
    }

    const deleteNote = async () => {
        const key = note.key; //database entry/node key for this note
        try {
            await Firebase.database().ref('notes/' + key).remove()
        .then(Alert.alert('Note deleted.'))
        navigation.navigate('FrontPage');
        } catch (error) {
            setMsg('Error in deleting note ' + error);
            console.log(msg);
        }
    }

    // describes slider number with words, takes emotion word (like 'sad') and slider value
    const interpret = (emotion, value) => {
        const adjectives = ['undocumented','neutrally', 'slightly', 'somewhat', 'very', 'extremely'];
        if (value === 0) {
            return 'undocumented'
        } else {
            return adjectives[value] + ' ' + emotion;
        }
    }

    // huom: yritetty tehdä asetus näin: setOtherEmotions({...otherEmotions, [e.target.name]: e.target.value}), mutta ei onnistunut
    const handleOtherEmotion = (e, emotion) => {
        let name = emotion;
        setOtherEmotions({...otherEmotions, [name]: e});
    }

    const handleCancel = () => {
        navigation.navigate('FrontPage');
    }

  return (
    <View style={styles.container}>
    <SafeAreaView style={styles.container}>
        <ScrollView style= {styles.safeareaView}>
        <View style={styles.headingContainer}>
            <Text style={styles.heading1}>Edit note</Text>
        </View>
       <View style={styles.headingContainer}>
            <Text style={styles.heading2}>{note.dateString}</Text>
        </View>
        
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
            />
            <TextInput
                multiline={true}
                numberOfLines={4}
                scrollEnabled={true}
                style={styles.input}
                onChangeText={setBody}
                value={body}
            />
        </View>
        <View name ='emotionsHeader' style= {styles.headingPicker}>
            <Text style={styles.heading2}>Basic mood</Text>
        </View>
        <View style= {styles.sliders}>
              <View style={styles.text}><Text>Sadness: {interpret('sad', sadValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={5}
                    minimumTrackTintColor="#071ff2"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#071ff2"
                    step={1}
                    value={sadValue}
                    onValueChange={setSadValue}
                    onSlidingComplete={setSadValue}            
                />
              </View>
              <View style={styles.text}><Text>Happiness: {interpret('happy', happyValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={5}
                    minimumTrackTintColor="#20c40a"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#20c40a"
                    step={1}
                    value={happyValue}
                    onValueChange={setHappyValue}
                    onSlidingComplete={setHappyValue}              
                />
              </View>
              <View style={styles.text}><Text>Anxiety: {interpret('anxious', anxiousValue)}</Text></View>
              <View style={styles.slider}>
                <Slider
                    style={{width: '100%', height: 60}}
                    minimumValue={0}
                    maximumValue={5}
                    minimumTrackTintColor="#f70505"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#f70505"
                    step={1}
                    value={anxiousValue}
                    onValueChange={setAnxiousValue}
                    onSlidingComplete={setAnxiousValue}           
                />
              </View>
        </View>
        <View name ='otherEmotionsHeader' style= {styles.headingPicker}>
            <Text style={styles.heading2}>Other emotions</Text>
        </View>
        <View style={styles.pickers}>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='anger'
                value={otherEmotions.anger}
                onValueChange={(e) => handleOtherEmotion(e, 'anger')}
                color={otherEmotions.anger ? '#b2c4df' : undefined}
                />
                <Text style={styles.pickerText}>Anger</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='shame'
                value={otherEmotions.shame}
                onValueChange={(e) => handleOtherEmotion(e, 'shame')}
                color={otherEmotions.shame ? '#b2c4df' : undefined}
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
                color={otherEmotions.fear ? '#b2c4df' : undefined}
                />
                <Text style={styles.pickerText}>Fear</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='trust'
                value={otherEmotions.trust}
                onValueChange={(e) => handleOtherEmotion(e, 'trust')}
                color={otherEmotions.trust ? '#b2c4df' : undefined}
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
                color={otherEmotions.disgust ? '#b2c4df' : undefined}
                />
                <Text style={styles.pickerText}>Disgust</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='surprise'
                value={otherEmotions.surprise}
                onValueChange={(e) => handleOtherEmotion(e, 'surprise')}
                color={otherEmotions.surprise ? '#b2c4df' : undefined}
                />
                <Text style={styles.pickerText}>Surprise</Text>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveEdit}>
                <View>
                    <AntDesign name="save" size={50} color="#6689bf" />  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View>
                    <AntDesign name="leftcircle" size={40} color="#DAD3C7" />  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteNote}>
                <View>
                    <AntDesign name="delete" size={42} color="#C85D6F" />  
                </View>
            </TouchableOpacity>
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