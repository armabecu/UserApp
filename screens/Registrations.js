import {
  Text,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Pressable,
  FlatList,
} from "react-native";
import Styles from "../Styles";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth } from "../firebaseConfig";
import BookingDetail from "./BookingDetail";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function Registrations({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const isFocused = useIsFocused();

  async function loadBookings() {
    const authUser = getAuth().currentUser;
    if (authUser != null) {
      const bookingsSnapshot = await getDocs(
        collection(db, "renters", authUser.uid, "bookings")
      );
      setBookings(bookingsSnapshot.docs.map((doc) => doc.data()));
    } else {
      console.log("No user");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadBookings();
    }
  }, [isFocused]);

  async function signOut() {
    auth.signOut().then(() => console.log("User signed out!"));
  }

  return (
    <SafeAreaView>
      <View style={Styles.screen}>
        <Text style={Styles.header}>Registrations</Text>
        <FlatList
          style={{ paddingTop: 20 }}
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("BookingDetail", { booking: item })
              }
            >
              <View
                style={Styles.listItem}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  {item.name}
                </Text>
                <AntDesign name="right" size={24} color="gray" />
              </View>
            </Pressable>
          )}
        />

        <Button title="Sign Out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}
