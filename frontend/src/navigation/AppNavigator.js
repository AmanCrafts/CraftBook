import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ROUTES from "../constants/routes";
import { useAuth } from "../contexts/AuthContext";

// Import screens
import LoginScreen from "../screens/Auth/LoginScreen";
import CreateHireRequestScreen from "../screens/Hire/CreateHireRequestScreen";
import HireRequestsScreen from "../screens/Hire/HireRequestsScreen";
import CreateListingScreen from "../screens/Marketplace/CreateListingScreen";
import ListingDetailScreen from "../screens/Marketplace/ListingDetailScreen";
import MyOrdersScreen from "../screens/Marketplace/MyOrdersScreen";
import PostDetailScreen from "../screens/PostDetail/PostDetailScreen";
import CompleteProfileScreen from "../screens/Profile/CompleteProfileScreen";
import UserProfileScreen from "../screens/Profile/UserProfileScreen";
import MainNavigator from "./MainNavigator";

const Stack = createStackNavigator();

// App Navigator - root navigation structure with authentication
const AppNavigator = () => {
  const { loading, isAuthenticated, user } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  // Determine initial route based on auth state
  // User is created directly during registration, so we go straight to MainApp
  const getInitialRoute = () => {
    if (!isAuthenticated || !user) {
      return ROUTES.LOGIN;
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
      <Stack.Screen
        name={ROUTES.USER_PROFILE}
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.LISTING_DETAIL}
        component={ListingDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.CREATE_LISTING}
        component={CreateListingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.MY_ORDERS}
        component={MyOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.CREATE_HIRE_REQUEST}
        component={CreateHireRequestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.HIRE_REQUESTS}
        component={HireRequestsScreen}
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
