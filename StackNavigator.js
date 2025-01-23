import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator, View, Platform, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { loadUserData } from './src/redux/userSlice';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utilities from './tailwind.json';
import { Provider, useDispatch } from 'react-redux';
import HomeScreen from './src/screens/HomeScreen';
import { UserProvider, UserContext } from './src/context/UserContext';
import store from './src/redux/store';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
            <TailwindProvider utilities={utilities}>
              <Image style={{position: 'absolute', width:'100%', height:'100%'}} source={require('./src/assets/images/bg.png')} />
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);
        const isOnboardingWasStarted = await AsyncStorage.getItem('isOnboardingWasStarted');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardingVisible(false);
        } else if (isOnboardingWasStarted) {
          setOnboardingVisible(false);
        } else {
          setOnboardingVisible(true);
          await AsyncStorage.setItem('isOnboardingWasStarted', 'true');
        }
      } catch (error) {
        console.error('Error loading user', error);
      } finally {
        setInitializing(false);
      }
    };
    loadCurrentUser();
  }, [setUser]);

  if (initializing) {
    return (
      <View style={{justifyContent: 'center', flex: 1,  alignItems: 'center', backgroundColor: '#1A0001' }}>
        <ActivityIndicator size="large" color="#4E0003" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={onboardingVisible ? 'OnboardingScreen' : 'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default AppStack;
