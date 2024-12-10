import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Routing from './Routing';
import {NavigationContainer} from '@react-navigation/native';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Routing />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
