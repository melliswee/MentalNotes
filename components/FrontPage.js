import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity,StatusBar, Dimensions} from 'react-native';
import Firebase from '../config/Firebase';
import { AntDesign } from '@expo/vector-icons';

export default function FrontPage({navigation}) {

    const [notes, setNotes] = useState([]);
    const [ready, setReady] = useState(false);

    
    useEffect(() => {
        getNotes();
    }, []);
    

    const getNotes = async () => {
        let notes = [];
        try {
            await Firebase.database()
                .ref('/notes')
                .on('value', snapshot => {
                    if (snapshot.exists()) {
                        //console.log('got snapshot');
                        const data = snapshot.val();
                        //console.log('got data');
                        const n = Object.values(data);
                        notes = n;
                        console.log('Found your notes.');
                        setNotes(notes);
                        setReady(true);
                    }
                });
        } catch (error) {
            console.log("Error in finding notes " + error);
        }
    }
    
    const formatDate = (item) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
        let date = item.dateString;
        let dayOfTheWeek = item.dayOfTheWeek;
        return days[dayOfTheWeek] + ' ' + date;
    }

    return (
        <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.headerFont}>Notes</Text>
                </View>
                <View style={styles.list}>
                    {ready &&
                    <FlatList
                        data={notes}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) =>
                            <View style={styles.listcontainer}>
                                <Text>{formatDate(item)}</Text>
                                <View style={styles.mood}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Note', item)}>
                                        <View>
                                            <AntDesign name="rightcircle" size={40} color="#DAD3C7" />  
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    />
                }
                </View>
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
    greeting: {
        flex: 2,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listcontainer: {
        width: 350,
        marginBottom: 10,
        padding: 20,
        borderBottomColor: '#b2c4df',
        borderBottomWidth: 2,
    },
    btn: {
        backgroundColor: '#b2c4df',
        borderRadius: 75
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerFont: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    mood: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});