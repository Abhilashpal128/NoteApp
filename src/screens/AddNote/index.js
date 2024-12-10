import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {insertNote, openDatabase} from '../../../Database';
import {useSelector} from 'react-redux';
import {
  Button,
  Checkbox,
  CheckIcon,
  Heading,
  Select,
  Spinner,
} from 'native-base';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Geolocation from '@react-native-community/geolocation';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import CameraImage from '../../components/camera/CameraImage';

export default function AddNote({navigation, route}) {
  const [extraInfo, setExtraInfo] = useState(false);
  const [LocationLoading, setLocationLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [location, setLocation] = useState(null);
  const Categories = [
    {label: 'Category 1', value: '1'},
    {label: 'Category 2', value: '2'},
  ];
  const user = useSelector(state => state?.user?.userData);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm();

  const onSubmit = async data => {
    console.log(data);
    setIsLoading(true);
    await insertNote(
      data?.title,
      data?.description,
      data?.category,
      user?.id,
      imageUri,
      location?.latitude?.toString(),
      location?.longitude?.toString(),
    )
      .then(noteId => {
        console.log('Note inserted with ID:', noteId);
        reset({
          title: '',
          description: '',
          category: '',
        });
        setImageUri('');
        setLocation(null);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error inserting note:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    navigation.goBack();
  };

  // useEffect(() => {
  //   openDatabase();
  // }, []);

  const handleLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          const checkEnabled = await isLocationEnabled();
          console.log('checkEnabled', checkEnabled);
          if (checkEnabled) {
            getLocation();
          } else {
            try {
              const enableResult = await promptForEnableLocationIfNeeded();
              console.log('enableResult', enableResult);
              if (
                enableResult === 'already-enabled' ||
                enableResult === 'enabled'
              ) {
                getLocation();
              }
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert('error While enabling location');
              }
            }
          }

          // getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getLocation();
    }
  };

  const getLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        setLocationLoading(false);
      },
      error => {
        console.error(error.message);
        setLocationLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const validateWordLimit = value => {
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount > 20) {
      // Show alert when word limit exceeds
      Alert.alert('Limit Exceeded', 'You cannot enter more than 20 words.', [
        {text: 'OK'},
      ]);
      // Set an error in the form state
      setError('inputField', {
        type: 'manual',
        message: 'You cannot enter more than 20 words.',
      });
      return false;
    }
    return true;
  };

  const requestPermission = async () => {
    const permissionStatus = await Camera.requestCameraPermission();
    if (permissionStatus === 'granted') {
      setCameraVisible(true);
    } else {
      alert('Camera permission is required to take photos.');
    }
    // setCameraVisible(true);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {cameraVisible ? (
        <View style={{flex: 1}}>
          <CameraImage
            setCameraVisible={setCameraVisible}
            setImageUri={setImageUri}
            cameraVisible={cameraVisible}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {isLoading ? (
            <View>
              <Spinner accessibilityLabel="Loading posts" />
              <Heading color="primary.500" fontSize="md">
                Adding Note...
              </Heading>
            </View>
          ) : (
            <ScrollView style={{maxHeight: '80%', width: '100%'}}>
              <View style={styles.subContainer}>
                <Controller
                  name="title"
                  rules={{
                    required: 'title is required',
                    // validate: validateWordLimit,
                  }}
                  control={control}
                  render={({
                    field: {onChange, onBlur, value},
                    fieldState: {error},
                  }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Title"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholderTextColor={'#666'}
                      maxLength={200}
                    />
                  )}
                />
                {errors?.title && (
                  <Text style={styles.error}>{errors?.title?.message}</Text>
                )}
                <Controller
                  name="category"
                  rules={{
                    required: 'Description  is Required',
                  }}
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <Select
                      selectedValue={value}
                      rounded={10}
                      mixWidth="80%"
                      width="80%"
                      accessibilityLabel="Select Category"
                      placeholder="Select Category"
                      _selectedItem={{
                        bg: 'teal.600',
                        endIcon: <CheckIcon size="5" />,
                      }}
                      borderColor={'#666666'}
                      mb={3}
                      onValueChange={onChange}>
                      {Categories?.map((data, index) => (
                        <Select.Item label={data?.label} value={data?.value} />
                      ))}
                    </Select>
                  )}
                />
                {errors?.category && (
                  <Text style={styles.error}>{errors?.category?.message}</Text>
                )}

                <Controller
                  name="description"
                  rules={{
                    required: 'Description  is Required',
                  }}
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Description"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      numberOfLines={5}
                      textAlignVertical="top"
                      placeholderTextColor={'#666'}
                      maxLength={600}
                    />
                  )}
                />
                {errors?.description && (
                  <Text style={styles.error}>
                    {errors?.description?.message}
                  </Text>
                )}
                <View>
                  <Checkbox
                    isChecked={extraInfo}
                    onChange={() => {
                      setExtraInfo(prev => !prev);
                    }}
                    my={2}>
                    Add More Information
                  </Checkbox>
                </View>
                {extraInfo && (
                  <View style={styles.AditionalInfo}>
                    {imageUri ? (
                      <Image
                        source={{uri: 'file://' + imageUri}}
                        style={styles.image}
                      />
                    ) : (
                      <Button
                        maxHeight={10}
                        size="sm"
                        variant="outline"
                        colorScheme={'#8A2BE2'}
                        onPress={() => {
                          requestPermission();
                          // setCameraVisible(true);
                        }}>
                        Add Image
                      </Button>
                    )}
                    {location !== null ? (
                      <View>
                        <View>
                          <Text style={styles?.latlongHeaderText}>
                            Lattitude:
                          </Text>
                          <Text style={styles?.latLongText}>
                            {location?.latitude}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.latlongHeaderText}>
                            Loggitude:
                          </Text>
                          <Text style={styles?.latLongText}>
                            {location?.longitude}
                          </Text>
                        </View>
                      </View>
                    ) : LocationLoading ? (
                      <View>
                        <Spinner accessibilityLabel="Loading posts" />
                        <Heading color="primary.500" fontSize="md">
                          Getting your location...
                        </Heading>
                      </View>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme={'#8A2BE2'}
                        maxHeight={10}
                        onPress={handleLocationPermission}>
                        Add Location
                      </Button>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit(onSubmit)}>
                  <Text style={styles.buttonText}>Add Note</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      )}
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
  AditionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    marginTop: 10,
  },
  latlongHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  latLongText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});
