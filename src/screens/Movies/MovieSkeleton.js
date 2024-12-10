import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Skeleton} from 'native-base';

export default function MovieSkeleton() {
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / numColumns - 20;
  return Array.from({length: 15}).map((_, index) => {
    <View key={index} style={styles.skeletonContsiner}>
      <Skeleton h="140" w={itemWidth} rounded="md" startColor="coolGray.100" />
    </View>;
  });
}

const styles = StyleSheet.create({
  skeletonContsiner: {
    height: '100%',
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
