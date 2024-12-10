import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AddNote = () => {
  // insertNote('Note Title 1', 'Description for note 1', '1', userId)
  // .then(noteId => {
  //   console.log('Note inserted with ID:', noteId);
  // })
  // .catch(error => {
  //   console.error('Error inserting note:', error);
  // });

  return (
    <View style={styles.container}>
      <Text>Add Note Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddNote;
