import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../src/screens/Auth/Login';
import SignUp from '../src/screens/Auth/SignUp';

export default function AuthRouting() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={SignUp} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
