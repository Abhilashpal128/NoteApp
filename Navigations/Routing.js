import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Notes from '../src/screens/Notes';
import {AddNoteNavigator, NotesNavigator} from './StackNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthRouting from './AuthRouting';
import CategoryTwo from '../src/screens/Notes/CategoryTwo';
import CategoryOne from '../src/screens/Notes/CategoryOne.js';
import AddNote from '../src/screens/AddNote/index.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryOneIcon from 'react-native-vector-icons/Fontisto';
import LogoutIcon from 'react-native-vector-icons/Entypo';
import BAckIcon from 'react-native-vector-icons/FontAwesome5';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../src/Redux/slices/userSlice.js';
import {AlertDialog, Avatar, Button, Menu, Pressable} from 'native-base';
import Movies from '../src/screens/Movies/Movies.js';
import MovieDescription from '../src/screens/Movies/MovieDescription.js';

const CustomHeader = ({routeName, navigation}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.userData);
  const cancelRef = React.useRef(null);

  const onClose = () => setIsOpen(false);

  return (
    <View style={styles.headerContainer}>
      <View>
        {routeName === 'Add Note' && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <BAckIcon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.headerText}>{routeName}</Text>
      <View>
        <Menu
          w="190"
          trigger={triggerProps => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}>
                <Avatar bg="indigo.500" size="md">
                  {user?.username?.slice(0, 2)}
                </Avatar>
              </Pressable>
            );
          }}>
          <Menu.Item
            onPress={() => {
              // dispatch(logout());
              setIsOpen(!isOpen);
            }}>
            Log Out <LogoutIcon name="log-out" size={24} color="#000" />
          </Menu.Item>
        </Menu>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header style={{borderBottomWidth: 0}}>
              LogOut!
            </AlertDialog.Header>
            <AlertDialog.Body style={{borderBottomWidth: 0}}>
              Are you sure? want's to Logout
            </AlertDialog.Body>
            <AlertDialog.Footer style={{borderTopWidth: 0}}>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}>
                  Cancel
                </Button>
                <Button
                  colorScheme="danger"
                  onPress={() => {
                    dispatch(logout());
                  }}>
                  Logout
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </View>
    </View>
  );
};
function BottomTabNAvigator() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({navigation, route}) => ({
        header: () => (
          <CustomHeader routeName={route.name} navigation={navigation} />
        ), // Pass the current route name to the header
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
          position: 'absolute',
        },
        tabBarActiveTintColor: '#6200ee',
      })}>
      <Tab.Screen
        name="Category 1"
        component={CategoryOne}
        options={{
          // headerShown: false,
          tabBarLabel: 'Category 1',
          tabBarLabelStyle: {fontSize: 16, fontWeight: 'semibold'},
          tabBarIcon: ({color, size}) => (
            <CategoryOneIcon name="onenote" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Category 2"
        component={CategoryTwo}
        options={{
          // headerShown: false,
          tabBarLabel: 'Category 2',
          tabBarLabelStyle: {fontSize: 16, fontWeight: 'semibold'},
          tabBarIcon: ({color, size}) => (
            <Icon name="microsoft-onenote" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Note"
        component={AddNote}
        options={{
          // headerShown: false,
          tabBarLabel: 'Category 3',
          tabBarButton: () => null,
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
export default function Routing() {
  const user = useSelector(state => state?.user?.isLoggedIn);
  console.log(`user2222222222`, user);

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            component={BottomTabNAvigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Movies"
            component={Movies}
            // options={{headerShown: false}}
          />
          <Stack.Screen
            name="MovieDescription"
            component={MovieDescription}
            // options={{headerShown: false}}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthRouting}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#6200ee',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
