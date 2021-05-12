import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, SafeAreaView, ScrollView} from 'react-native';
import Firebase from '../config/Firebase';

export default function FrontPage({navigation}) {

    const [notes, setNotes] = useState([]);
    const [ready, setReady] = useState(false);
    const monthlyNotes = ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    
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

    const createMonths = () => {
        let i;
        //let j;
        //const yearsFound = checkYears();
        //console.log('years found ' + yearsFound.length)
        //for (j=0; j < yearsFound.length; j++) {
            //console.log('year is ' + yearsFound[j]);
            for (i=0; i < monthlyNotes.length; i++) {
                //console.log('month is ' + monthlyNotes[i])
                return monthlyNotes.map((month) => {
                    return(
                        <View key= {month} style={styles.listcontainer}>
                            <View style={styles.row}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{month}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Greeting', i)}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}> Notes </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            }
        //}
    }

    // gets notes and check how many unique years are found among notes, not used rigth now
    const checkYears = () => {
        if (ready) {
            const years = notes.map((note) => note.year)
            const uniqueYears = Array.from(new Set(years));
            return uniqueYears; 
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <ScrollView style= {styles.safeareaView}>
                <View style={styles.title}>
                    <Text style={styles.headerFont}>Notes</Text>
                </View>
                {createMonths()}
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
        borderRadius: 100
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});