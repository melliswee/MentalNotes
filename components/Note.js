import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import Firebase from '../config/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';


export default function Note({navigation, route}) {

    const note = route.params;
    const key = note.key;
    const [image, setImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    let imageRef = note.imageUrl;

    useEffect(() => {
        getImage();
    }, []);
    
    const getImage = () => {
        if (imageRef.length > 0) {
            imageRef = Firebase.storage().ref('images/' + key);
            imageRef.getDownloadURL()
            .then((url) => {
                setImage(url);
                setImageLoaded(true);
            })
            .catch((e) => console.log('Error retrieving image ' + e));
        }
    }

    // describes mood number with words, takes emotion word (like 'sad') and value
    const interpret = (emotion, value) => {
        const adjectives = ['undocumented', 'neutral', 'slightly', 'somewhat', 'very', 'extremely'];
        if (value === 0) {
            return 'undocumented'
        } else {
            return adjectives[value] + ' ' + emotion;
        }
    }

    const processMood = () => {
        let anxiety = note.mood.anxiety;
        let sadness = note.mood.sadness;
        let happiness = note.mood.happiness;

        if (anxiety === 'undocumented' || sadness === 'undocumented' || happiness === 'undocumented') {
            return(
            <View style ={styles.headingContainer}>
                <Text style={styles.boldBodytext}>General mood was not documented.</Text>
            </View>)
        } else {
            return(
                <View style ={styles.moodContainer}>
                    <Text style = {styles.heading2}> Today, I felt...</Text>
                    <Text style={styles.sadText}>
                        {interpret('sad', sadness)}
                    </Text>
                    <Text style={styles.anxiousText}>
                        {interpret('anxious', anxiety)}
                    </Text>
                    <Text style={styles.happyText}>
                        {interpret('happy', happiness)}
                    </Text>
                </View>
            );
        }
    }

    const processOtherEmotions = () => {
        const others = note.otherEmotions;
        const felt = [];

        for (let key in others) {
            //console.log('key is ' + key + ' value is ' + others[key])
            if(others[key] === true) {
                felt.push(key);
            }
        }

        if (others.anger === 'undocumented') {
            return(
                <View style ={styles.headingContainer}>
                    <Text style={styles.boldBodytext}>Other emotions were not documented.</Text>
                </View>
            );
        } else {
            return(
                <View style ={styles.headingContainer}>
                    <Text style = {styles.heading2}> I also felt...</Text>
                    {felt.map((e, index) => {return <Text key={index} style={styles.boldBodytext}>{e}</Text>})}
                    
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <ScrollView style= {styles.safeareaView}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading1}>{note.title}</Text>
                    </View>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading2}>{note.dateString}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                            {imageLoaded ?
                                <View style={styles.container}>
                                    <Image source={{uri: image}} style={styles.image} />
                                </View>
                            :
                                <Image source={require('../assets/no_image.png')} style={styles.image}/>
                            }
                    </View>
                    <View style={styles.bodyContainer}>
                        <Text style={styles.bodytext}>{note.body}</Text>
                    </View>
                    {processMood()}
                    {processOtherEmotions()}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('EditNote', note)}>
                            <View>
                                <AntDesign name="edit" size={50} color="#6689bf" />  
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () =>navigation.navigate('FrontPage')}>
                            <View>
                                <AntDesign name="leftcircle" size={42} color="#DAD3C7" />  
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
        paddingBottom: '5%'
    },
    bodyContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: '10%',
        marginTop: '5%',
        borderBottomColor: '#b2c4df',
        borderBottomWidth: 2,
    },
    heading1: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    bodytext: {
        fontSize: 20,
        marginBottom: '5%',
    },
    boldBodytext: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    headingContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '5%',
        borderBottomColor: '#b2c4df',
        borderBottomWidth: 2,
        marginHorizontal: '10%',
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
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moodContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sadText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"#071ff2"
    },
    anxiousText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"#f70505"
    },
    happyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"#20c40a"
    },
    buttonContainer: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: '5%',
    },
});