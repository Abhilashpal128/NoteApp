import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchMovies} from '../../../Database';
import {useSelector} from 'react-redux';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Heading, Skeleton, Spinner} from 'native-base';

export default function Movies() {
  const [Movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const SkeletonNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  // const Movies = useSelector(state => state?.movies?.movies);
  const ImageUri = 'https://image.tmdb.org/t/p/w500';
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / numColumns - 20;
  const navigation = useNavigation();
  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const movies = await fetchMovies();
      // console.log('Loaded Movies:', movies);
      setMovies(movies);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading movies:', error);
      setMovies([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  function MovieSkeleton() {
    return Array.from({length: 15}).map((_, index) => {
      <View key={index} style={styles.skeletonContsiner}>
        <Skeleton
          h="140"
          w={itemWidth}
          rounded="md"
          startColor="coolGray.100"
        />
      </View>;
    });
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MovieDescription', {item});
      }}
      style={[styles.MovieBox, {width: itemWidth}]}>
      <Text style={styles.titleText}>{item?.title}</Text>
      <Image
        source={{uri: `${ImageUri}${item?.poster_path}`}}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles?.container}>
        {isLoading ? (
          <View style={styles?.skeletonContainer}>
            {SkeletonNum?.map((num, index) => (
              <View key={index} style={{marginHorizontal: 'auto'}}>
                <Skeleton
                  h="140"
                  w={itemWidth}
                  rounded="md"
                  startColor="coolGray.500"
                />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={Movies}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            style={styles.mainListContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  MovieBox: {
    display: 'flex',
    height: 140,
    margin: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 3,
  },
  container: {
    width: '95%',
    marginHorizontal: 'auto',
    marginBottom: 150,
    height: '100%',
  },
  mainListContainer: {
    marginHorizontal: 'auto',
  },
  titleText: {
    flexWrap: 'wrap',
    height: 40,
    marginHorizontal: 'auto',
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    marginBottom: 10,
    marginHorizontal: 'auto',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 20,
    marginBottom: 200,
  },
  skeletonContainer: {
    height: '100%',
    width: '100%',
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 'auto',
  },
});
