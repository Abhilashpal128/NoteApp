import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect} from 'react';

export default function MovieDescription({navigation, route}) {
  const Movie = route?.params?.item;
  const ImageUri = 'https://image.tmdb.org/t/p/w500';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headercontainer}>
          <Text style={styles.headertitle}>{Movie?.title}</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#6200ee',
      },
      headerTintColor: '#fff',
    });
  }, [navigation, Movie]);

  console.log(Movie);

  return (
    <SafeAreaView style={styles?.mainContainer}>
      <View style={styles.firstContainer}>
        <ImageBackground source={{uri: `${ImageUri}${Movie?.backdrop_path}`}}>
          <View style={styles.displayContainer}>
            <View style={{}}>
              <Text style={styles?.title}>{Movie?.title}</Text>
            </View>
            <TouchableOpacity style={styles?.watchNowButton}>
              <Text style={styles?.buttonText}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.overViewContainer}>
        <Text style={styles.overViewTitle}>Overview: </Text>
        <Text style={styles.overViewText}>{Movie?.overview}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomContentTitle}>Released On: </Text>
          <Text style={styles.bottomContentText}>{Movie?.release_date}</Text>
        </View>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomContentTitle}>Downloads: </Text>
          <Text style={styles.bottomContentText}>{Movie?.vote_count}</Text>
        </View>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomContentTitle}>Ratings: </Text>
          <Text style={styles.bottomContentText}>{Movie?.vote_average}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headercontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headertitle: {
    fontSize: 20,
    color: '#fff',
  },
  mainContainer: {height: '100%', backgroundColor: '#FFFFFF'},
  firstContainer: {height: '30%'},
  displayContainer: {
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 10,
    color: '#FFFFFF',
    margin: 10,
  },
  watchNowButton: {
    backgroundColor: 'blue',
    width: '30%',
    height: 35,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {color: '#FFFFFF'},
  overViewContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  overViewTitle: {fontSize: 20, fontWeight: 'bold'},
  overViewText: {color: '#666'},
  bottomContainer: {margin: 20, gap: 10},
  bottomContent: {display: 'flex', flexDirection: 'row'},
  bottomContentTitle: {fontSize: 16, fontWeight: 'bold', color: '#666'},
  bottomContentText: {fontSize: 16, color: '#666'},
});
