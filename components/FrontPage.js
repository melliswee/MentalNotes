import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity,} from 'react-native';
import Firebase from '../config/Firebase';
import Greeting from './Greeting';

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
    
    const formatDate = (dateString) => {
        let date = dateString
        return date;
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
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                            <View style={styles.mood}>
                                <Text>{formatDate(item.dateString)}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Greeting', item)}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>To Hello</Text>
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
    },
    list: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listcontainer: {
        width: 350,
        borderWidth: 2,
        marginBottom: 10,
        padding: 5,
        borderColor: '#4630EB'
    },
    btn: {
        backgroundColor: '#4630EB',
        borderRadius: 5
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
        fontSize: 25,
        fontWeight: 'bold'
    },
    mood: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});