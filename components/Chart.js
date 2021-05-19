import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Firebase from '../config/Firebase';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chart() {

    const [notes, setNotes] = useState([]);
    const [ready, setReady] = useState(false);
    const [moodData, setMoodData] = useState([]);
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };
    
    useEffect(() => {
        getNotes();
    }, []);

    useEffect(() => {
        getMood();
    }, [notes]);

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

    const getMood = () => {
        // moods[0] = sadness, moods[1]=happiness, moods[2]=anxiety
        const moods = [0, 0, 0]
        const filter = notes.map(note => {
            let sadness = note.mood.sadness;
            let happiness = note.mood.happiness;
            let anxiety = note.mood.anxiety;
            moods[0] += sadness;
            moods[1] += happiness;
            moods[2] += anxiety;            
        })

        const data =[
            {
                name: "Sadness",
                value: moods[0],
                color: "rgba(7, 27, 242, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "Happiness",
                value: moods[1],
                color: "rgba(32, 196, 10, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            },
            {
                name: "Anxiety",
                value: moods[1],
                color: "rgba(247, 5, 5, 1)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            }
        ]
        setMoodData(data);
    }
    
  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.container}>
            <ScrollView style= {styles.safeareaView}>
                <View style={styles.headingContainer}>
                    <Text style={styles.heading1}>Charts</Text>
                </View>
                <View style={styles.headingContainer}>
                    <Text style={styles.heading2}> Overall mood</Text>
                </View>
                <View style={styles.container}>
                    <PieChart
                        data={moodData}
                        width={400}
                        height={250}
                        chartConfig={chartConfig}
                        accessor={"value"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[20, 0]}
                        absolute
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
        paddingVertical: '10%'
    },
    heading1: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headingContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeareaView: {
        marginHorizontal: 20
     },
});