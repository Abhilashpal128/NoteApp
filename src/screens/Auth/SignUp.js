import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {insertUser} from '../../../Database';
import {useNavigation} from '@react-navigation/native';
import SignUpIcons from 'react-native-vector-icons/MaterialIcons';
import {Icon, Input, Pressable} from 'native-base';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const onSubmit = async data => {
    const {username, email, password} = data;

    // Basic validation
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long!');
      return;
    }

    try {
      await insertUser(username, email, password);
      Alert.alert('Registration successful', 'You can now log in.');
      reset({
        username: '',
        email: '',
        password: '',
      });
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error?.message);
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Controller
            name="username"
            rules={{
              required: 'Full Name is required',
            }}
            control={control}
            render={({field: {onChange, value, onBlur}}) => (
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
                    as={<SignUpIcons name="person" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
                placeholder="Full Name"
                color={'#000000'}
              />
              // <TextInput
              //   style={styles?.input}
              //   placeholder="Full Name"
              //   onChangeText={onChange}
              //   value={value}
              //   onBlur={onBlur}
              //   placeholderTextColor={'#666'}
              // />
            )}
          />
          {errors?.username && (
            <Text style={styles.error}>{errors?.username?.message}</Text>
          )}
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
            render={({field: {onChange, value, onBlur}}) => (
              <Input
                w={'80%'}
                borderColor={'#666'}
                rounded={10}
                mt={5}
                placeholderTextColor={'#666'}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                InputLeftElement={
                  <Icon
                    as={<SignUpIcons name="email" />}
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
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            }}
            control={control}
            render={({field: {onChange, value, onBlur}}) => (
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
                    as={<SignUpIcons name="key" />}
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
                        <SignUpIcons
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
              //   style={styles?.input}
              //   placeholder="Password"
              //   onChangeText={onChange}
              //   value={value}
              //   onBlur={onBlur}
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
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.redirectContainer}>
            <Text style={styles.redirectText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.redirectLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
