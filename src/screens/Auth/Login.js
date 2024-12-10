import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  dropNotesTable,
  getUser,
  insertMovies,
  openDatabase,
} from '../../../Database';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/slices/userSlice';
import {Icon, Input, Pressable} from 'native-base';
import EyeIcon from 'react-native-vector-icons/MaterialIcons';
import {setMovies} from '../../Redux/slices/Movies';
import axios from 'axios';

export default function Login() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();
  // const dispatch=useDispatch();

  useEffect(() => {
    // externalData();
    // const initializeDb = async () => {
    //   openDatabase();
    // };
    // initializeDb();
    // const dropTable = async () => {
    //   await dropNotesTable()
    //     .then(result => {
    //       console.log(result);
    //     })
    //     .catch(err => {
    //       console.error('Failed to drop notes table:', err);
    //     });
    // };
    // dropTable();
  }, []);

  const onSubmit = async data => {
    const {email, password} = data;
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    try {
      const user = await getUser(email, password);
      if (user) {
        console.log(JSON.stringify(user));
        Alert.alert('Login Successful', `Welcome, ${user.email}`);
        dispatch(setUser(user));
        reset({
          email: '',
          password: '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
      console.log(`error: ${error}`);
    }
    console.log(data);
    // navigation.navigate('Register');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Controller
            name="email"
            rules={{
              required: 'email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            }}
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={'80%'}
                borderColor={'#666'}
                rounded={10}
                placeholderTextColor={'#666'}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                InputLeftElement={
                  <Icon
                    as={<EyeIcon name="email" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
                placeholder="Email"
                color={'#000000'}
              />
            )}
          />
          {errors?.email && (
            <Text style={styles.error}>{errors?.email?.message}</Text>
          )}
          <Controller
            name="password"
            rules={{
              required: 'Password  is Required',
            }}
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                w={{
                  base: '80%',
                  md: '25%',
                }}
                mt={5}
                borderColor={'#666'}
                rounded={10}
                placeholderTextColor={'#666'}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                type={passwordVisible ? 'text' : 'password'}
                InputLeftElement={
                  <Icon
                    as={<EyeIcon name="key" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
                InputRightElement={
                  <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon
                      as={
                        <EyeIcon
                          name={
                            passwordVisible ? 'visibility' : 'visibility-off'
                          }
                        />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
                placeholder="Password"
                color={'#000000'}
              />
              // <TextInput
              //   style={styles.input}
              //   placeholder="Password"
              //   // secureTextEntry={}
              //   onBlur={onBlur}
              //   onChangeText={onChange}
              //   value={value}
              //   placeholderTextColor={'#666'}
              // />
            )}
          />
          {errors?.password && (
            <Text style={styles.error}>{errors?.password?.message}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.redirectContainer}>
            <Text style={styles.redirectText}>do not have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text style={styles.redirectLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {width: '100%', height: '100%', backgroundColor: '#fff'},
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 10,
    width: '80%',
    marginHorizontal: 'auto',
    borderRadius: 10,
    color: '#000',
  },
  error: {
    textAlign: 'left',
    color: 'red',
    marginBottom: 10,
    width: '80%',
  },
  subContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
  },
  redirectContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  redirectText: {
    color: '#000',
  },
  redirectLinkText: {
    color: '#0000EE',
  },
});
