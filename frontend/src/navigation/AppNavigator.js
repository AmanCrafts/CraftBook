import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from '../constants/routes';

// Import screens
import LoginScreen from '../screens/Auth/LoginScreen';
import CompleteProfileScreen from '../screens/Profile/CompleteProfileScreen';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

// App Navigator - root navigation structure
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{
          title: 'CraftBook',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.COMPLETE_PROFILE}
        component={CompleteProfileScreen}
        options={{
          title: 'Complete Profile',
          headerLeft: null, // Prevent going back
        }}
      />
      <Stack.Screen
        name={ROUTES.MAIN_APP}
        component={MainNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent going back with gesture
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
