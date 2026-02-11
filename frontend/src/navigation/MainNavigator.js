import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "../constants/colors";
import ROUTES from "../constants/routes";

// Import screens
import ExploreScreen from "../screens/Explore/ExploreScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import MarketplaceScreen from "../screens/Marketplace/MarketplaceScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import UploadScreen from "../screens/Upload/UploadScreen";

const Tab = createBottomTabNavigator();

// Main Navigator - bottom tab navigation with modern icons
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.HOME) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === ROUTES.EXPLORE) {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === ROUTES.MARKETPLACE) {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === ROUTES.UPLOAD) {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === ROUTES.PROFILE) {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name={ROUTES.EXPLORE}
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name={ROUTES.MARKETPLACE}
        component={MarketplaceScreen}
        options={{
          tabBarLabel: "Shop",
        }}
      />
      <Tab.Screen
        name={ROUTES.UPLOAD}
        component={UploadScreen}
        options={{
          tabBarLabel: "Upload",
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
