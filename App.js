/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './Navigations/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './src/Redux/store';
import RNBootSplash from 'react-native-bootsplash';
import {NativeBaseProvider} from 'native-base';
import {
  dropNotesTable,
  emptyTables,
  insertMovies,
  openDatabase,
} from './Database';
import axios from 'axios';
import {setMovies} from './src/Redux/slices/Movies';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  // const dispatch = useDispatch();

  const backgroundStyle = {
    backgroundColor: '#fff',
    height: '100%',
  };

  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  const externalData = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/movie?api_key=136b6ee4e6eaedf9acaa706efcbf2133',
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzZiNmVlNGU2ZWFlZGY5YWNhYTcwNmVmY2JmMjEzMyIsIm5iZiI6MTcyNjEzNjI2MS4zMDQxODYsInN1YiI6IjY2ZTJiZWNkYzgxYjI0YjNmZTIzODcyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6vGzVOyK-tZEt69e-50rzasmddlGz-SWYKES_vPhCas',
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log(`data`, response?.data?.results);
    await insertMovies(response?.data?.results);
    // dispatch(setMovies(response?.data?.results));
  };

  useEffect(() => {
    const initializeDb = async () => {
      openDatabase();
    };

    externalData();

    initializeDb();
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      RNBootSplash.hide({fade: true});
    };
    hideSplash();
  }, []);

  return (
    <NativeBaseProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={'#6200ee'}
        />
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
