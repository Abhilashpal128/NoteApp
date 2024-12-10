import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Notes from '../src/screens/Notes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddNote from '../src/screens/AddNote';
import Login from '../src/screens/Auth/Login';
import CategoryTwo from '../src/screens/Notes/CategoryTwo';
import CategoryOne from '../src/screens/Notes/CategoryOne.js';

export function NotesNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Login" component={Login} /> */}
      <Stack.Screen
        name="Notes"
        component={CategoryOne}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function AddNoteNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddNote"
        component={CategoryTwo}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
