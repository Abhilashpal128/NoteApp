import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Notes from '..';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getNotesByUser, insertMovies} from '../../../../Database';
import {useSelector} from 'react-redux';
import AddButtonIcon from 'react-native-vector-icons/AntDesign';
import NotesSkeleton from '../../../components/skeletons/NotesSkeleton';
import axios from 'axios';

export default function CategoryOne() {
  const [isLoading, setIsLoading] = useState(true);
  const [Categorynotes, setCategoryNotes] = useState([]);
  const user = useSelector(state => state?.user?.userData);
  console.log(`user`, user);

  const isFocused = useIsFocused();

  async function FetchNotesBycategory() {
    // setIsLoading(true);
    await getNotesByUser(user?.id, '1')
      .then(notes => {
        console.log('Notes in category 1:', notes);
        setIsLoading(false);
        setCategoryNotes(notes);
      })
      .catch(error => {
        console.error('Error fetching category 1 notes:', error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    FetchNotesBycategory();
  }, [isFocused]);

  const navigation = useNavigation();
  return isLoading ? (
    <View>
      <NotesSkeleton />
      <NotesSkeleton />
      <NotesSkeleton />
      <NotesSkeleton />
      <NotesSkeleton />
    </View>
  ) : (
    <View>
      <Notes
        notes={Categorynotes}
        isLoading={isLoading}
        FetchNotesBycategory={FetchNotesBycategory}
        setIsLoading={setIsLoading}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate('Add Note', {category: 1});
        }}>
        <AddButtonIcon name="pluscircleo" size={20} color="#fff" />
        <Text style={styles.ButtonText}>Add Note</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.MovieButton}
        onPress={() => {
          navigation.navigate('Movies');
        }}>
        <AddButtonIcon name="pluscircleo" size={20} color="#fff" />
        <Text style={styles.ButtonText}>Movie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  MovieButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
