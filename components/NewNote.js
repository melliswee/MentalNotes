import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import Firebase from '../config/Firebase';
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function NewNote({ navigation }) {

    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sadValue, setSadValue] = useState(1);
    const [happyValue, setHappyValue] = useState(1);
    const [anxiousValue, setAnxiousValue] = useState(1);
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

    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [done, setDone] = useState(false);
    const [photoLocalUri, setPhotoLocalUri] = useState('');

    const saveNote = async () => {
        let key = getKey(); //database entry/node key for this note
        let date = new Date();
        let imageDbURL ='';

        if (image !== null) {
            let imagekey = key;
            imageDbURL = (Firebase.storage().ref().child("images/" + imagekey)).toString(); //image's cloud storage address
    
            let newLocalUri = await compressImage(photoLocalUri);
    
            uploadImage(newLocalUri, imagekey)
            .then(() => {
                console.log('Saved image to the storage');
            })
            .catch((error) => {
                console.log('Failed to upload image: ' + error);
            });
        }

        try {
            await Firebase.database().ref('notes/' + key).set(
            {
                key: key,
                title: title,
                body: body,
                dateString: formatDate(), //db does not accept date as is but as String
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
                },
                imageUrl: imageDbURL
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
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();  
    }

    const clearFields = () => {
        setMsg('');
        setTitle('');
        setBody('');
        setSadValue(1);
        setHappyValue(1);
        setAnxiousValue(1);
        setOtherEmotions({'shame': false, 'fear': false, 'trust': false, 'disgust': false, 'anger': false, 'surprise': false});
        setBasicChecked(true);
        setOtherChecked(true);
        setImage(null);
        setDone(false);
        setPhotoLocalUri('');
    }

    const getKey = () => {
        return Firebase.database().ref('notes/').push().getKey();
    }

    // describes slider number with words, takes emotion word (like 'sad') and slider value
    const interpret = (emotion, value) => {
        const adjectives = ['undocumented', 'neutrally', 'slightly', 'somewhat', 'very', 'extremely'];
        if (value === 0) {
            return 'undocumented'
        } else {
            return adjectives[value] + ' ' + emotion;
        }
    }

    // if user does not want to document their emotions in this note, set emotions to 'undocumented'
    const documentEmotions = () => {
        if (!basicIsChecked) {
            setSadValue(0);
            setAnxiousValue(0);
            setHappyValue(0);
        } else {
            setSadValue(1);
            setAnxiousValue(1);
            setHappyValue(1);
        }
    }

    const documentOtherEmotions = () => {
        setOtherEmotions({'shame': false, 'fear': false, 'trust': false, 'disgust': false, 'anger': false, 'surprise': false});   
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

    const launchCamera = async () => {
        if (camera) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.cancelled) {
                setPhotoLocalUri(result.uri);
                console.log('local uri: ' + result.uri);
                setImage(result);
                setDone(true);
            }
        }
    }

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = Firebase.storage().ref().child('images/' + imageName);
        return ref.put(blob);
    }

    const compressImage = async (uri) => {
        let manipulatedImage = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.5});
        return manipulatedImage.uri;
    }   

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
        <View style={styles.imageContainer}>
                <TouchableOpacity onPress={launchCamera}>
                    {done ?
                        <View style={styles.image}>
                            <Image source={image} style={styles.image} />
                        </View>
                        :
                        <Image source={require('../assets/add_photo.png')} style={styles.image} />
                    }
                </TouchableOpacity>
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
              color={basicIsChecked ? '#6689bf' : undefined}
              />
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
                    disabled={!basicIsChecked}              
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
                    disabled={!basicIsChecked}              
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
                    disabled={!basicIsChecked}              
                />
              </View>
        </View>
        <View name ='otherEmotionsHeader' style= {styles.headingPicker}><Text style={styles.heading2}>Other emotions</Text>
            <Checkbox
              value={otherIsChecked}
              onValueChange={setOtherChecked}
              color={otherIsChecked ? '#6689bf' : undefined}
              />
        </View>
        <View style={styles.pickers}>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='anger'
                value={otherEmotions.anger}
                onValueChange={(e) => handleOtherEmotion(e, 'anger')}
                color={otherIsChecked ? '#b2c4df' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Anger</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='shame'
                value={otherEmotions.shame}
                onValueChange={(e) => handleOtherEmotion(e, 'shame')}
                color={otherIsChecked ? '#b2c4df' : undefined}
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
                color={otherIsChecked ? '#b2c4df' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Fear</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='trust'
                value={otherEmotions.trust}
                onValueChange={(e) => handleOtherEmotion(e, 'trust')}
                color={otherIsChecked ? '#b2c4df' : undefined}
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
                color={otherIsChecked ? '#b2c4df' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Disgust</Text>
            </View>
            <View style= {styles.otherPicker}>
                <Checkbox
                name='surprise'
                value={otherEmotions.surprise}
                onValueChange={(e) => handleOtherEmotion(e, 'surprise')}
                color={otherIsChecked ? '#b2c4df' : undefined}
                disabled={!otherIsChecked}
                />
                <Text style={styles.pickerText}>Surprise</Text>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveNote}>
                <View>
                    <AntDesign name="save" size={50} color="#6689bf" />  
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel}>
                <View>
                    <AntDesign name="closecircleo" size={42} color="#C85D6F" />  
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '5%'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {        
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: undefined,
        aspectRatio: 3 / 2,
        resizeMode: 'contain'
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
        paddingVertical: '2%'
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