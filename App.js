import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "./screens/Search";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "./Theme";
import Styles from "./Styles";
import { auth } from "./firebaseConfig";
import Login from "./screens/Login";
import { useState } from "react";
import { useEffect } from "react";
import Registrations from "./screens/Registrations";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookingDetail from "./screens/BookingDetail";
const Tab = createBottomTabNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <Login />;
  }

  const BookingsStack = createNativeStackNavigator();
  function BookingsStackScreen() {
    return (
      <BookingsStack.Navigator>
        <BookingsStack.Screen
          name="Registrations"
          component={Registrations}
          options={{ headerShown: false }}
        />
        <BookingsStack.Screen
          name="BookingDetail"
          component={BookingDetail}
          options={{ headerShown: false }}
        />
      </BookingsStack.Navigator>
    );
  }


  return (
    <NavigationContainer theme={Theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Search") {
              iconName = focused = "search";
            } else if (route.name === "Registrations") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Registrations" component={BookingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
