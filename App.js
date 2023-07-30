import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "./screens/Search";
import Bookings from "./screens/Registrations";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "./Theme";
import Styles from "./Styles";
import { auth } from "./firebaseConfig";
import Login from "./screens/Login";
import { useState } from "react";
import { useEffect } from "react";
import Registrations from "./screens/Registrations";
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
  return (
    <NavigationContainer theme={Theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Listings") {
              iconName = focused = "ios-create";
            } else if (route.name === "Bookings") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#fff",
            borderRadius: 15,
            height: 70,
          },
        })}
      >
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Registrations" component={Registrations} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
