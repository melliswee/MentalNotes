import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function NewNote() {

    let [msg, setMsg] = useState('');
    let [note, setNote] = useState({title: '', body: '', date: new Date(), timestamp: Date.now()})

    const saveNote = async () => {
      try {
        await Firebase.database().ref('notes/').push({note})
        .then(setMsg('Note saved'))
        .then(Alert.alert(msg));
      } catch (error) {
        setMsg('Error in saving note ' + error);
        Alert.alert(msg);
      }
    }

  return (
    <View style={styles.container}>
            <Text>Create new note</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNote({...note, title: title})}
                value={title}
                placeholder='Note title'
            />
            <TextInput
                multiline
                numberOfLines={4}
                style={styles.input}
                onChangeText={setNote({...note, body: body})}
                value={body}
                placeholder='Message body'
            />
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
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10
},
});