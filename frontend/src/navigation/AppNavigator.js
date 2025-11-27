import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import ROUTES from "../constants/routes";
import { useAuth } from "../contexts/AuthContext";

// Import screens
import LoginScreen from "../screens/Auth/LoginScreen";
import CompleteProfileScreen from "../screens/Profile/CompleteProfileScreen";
import PostDetailScreen from "../screens/PostDetail/PostDetailScreen";
import MainNavigator from "./MainNavigator";

const Stack = createStackNavigator();

// App Navigator - root navigation structure with authentication
const AppNavigator = () => {
  const { loading, isAuthenticated, dbUser } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  // Determine initial route based on auth state
  const getInitialRoute = () => {
    if (!isAuthenticated) {
      return ROUTES.LOGIN;
    }
    if (!dbUser) {
      return ROUTES.COMPLETE_PROFILE;
    }
    return ROUTES.MAIN_APP;
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{
          title: "CraftBook",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.COMPLETE_PROFILE}
        component={CompleteProfileScreen}
        options={{
          title: "Complete Profile",
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
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default AppNavigator;
