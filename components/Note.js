import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Firebase from '../config/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Note({navigation, route}) {

    const note = route.params;
    const key = note.key;

    //const [note, setNote] = useState(null);

    /*
    useEffect(() => {
        getNote();
    }, []);
    */
    const getNote = async() => {
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
                    <View style={styles.bodyContainer}>
                        <Text style={styles.bodytext}>{note.body}</Text>
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
    bodyContainer: {
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: '10%',
    },
    heading1: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bodytext: {
        fontSize: 20,
        marginBottom: 5,
    },
    headingContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});