import {
  ActivityIndicator,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {Heading, Spinner} from 'native-base';

export default function CameraImage({
  setCameraVisible,
  setImageUri,
  cameraVisible,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const device = useCameraDevice('back'); // Get the back camera device
  const camera = useRef(null);

  // Function to take a photo
  const takePhoto = async () => {
    if (camera.current && device) {
      try {
        setIsLoading(true);
        console.log('Camera is ready');

        // Take the photo
        const photoData = await camera.current.takePhoto({
          qualityPrioritization: 'balanced',
        });
        console.log('Photo captured:', photoData);

        const photoPath = photoData?.path; // Ensure this is valid
        if (photoPath) {
          console.log('Photo path:', photoPath);
          setImageUri(photoPath); // Set the captured photo's URI
          setCameraVisible(false); // Hide the camera after taking the photo
        } else {
          console.error('No photo path found.');
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn('Camera or device not ready');
    }
  };

  // Request camera permission and back button handling (already handled before)

  if (device == null) return <ActivityIndicator />; // Show loading until the camera device is ready

  return (
    <View style={styles.container}>
      {/* {isLoading ? (
        <View>
          <Spinner accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="md">
            Capturing Image...
          </Heading>
        </View>
      ) : ( */}
      <Camera
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        style={styles.camera}
      />
      {/* )} */}
      <TouchableOpacity
        onPress={takePhoto}
        style={styles.Button}
        disabled={isLoading}>
        {isLoading ? (
          <Spinner accessibilityLabel="Loading posts" color={'#fff'} />
        ) : (
          <Text style={styles?.buttonText}>Take Photo</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 100,
  },
  camera: {
    flex: 1,
  },
  Button: {
    height: 40,
    width: '80%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
  },
});
