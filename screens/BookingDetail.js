import {
  Text,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import Styles from "../Styles";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import JaneDoeImage from "../assets/profile.png";
import JohnDoeImage from "../assets/profile02.png";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

export default function BookingDetail({ route, navigation }) {
  const { booking: initialBooking } = route.params;
  const [booking, setBooking] = useState(initialBooking);

  const [showconfirmationNumber, setShowConfirmationNumber] = useState(false);

  const [icon, setIcon] = useState("hour-glass");

  // useEffect(() => {
  //   if (booking.status == "Declined") {
  //     seticon("circle-with-cross");
  //   } else if (booking.status == "Approved") {
  //     seticon("check");
  //   }

  //   if (booking.status == "Approved") {
  //     setshowconfirmationNumber(true);
  //   }

  //   console.log(booking.uid);
  // }, [booking.status]);

  useEffect(() => {
    const bookingsCollection = collection(
      db,
      "renters",
      auth.currentUser.uid,
      "bookings"
    );
    const q = query(bookingsCollection, where("name", "==", booking.name));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs;

      if (docs.length > 0) {
        const bookingData = docs[0].data();
        setBooking(bookingData);
        if (bookingData.status === "Declined") {
          setIcon("circle-with-cross");
        } else if (bookingData.status === "Approved") {
          setIcon("check");
          setShowConfirmationNumber(true);
        }
      } else {
        console.log("No such document!");
      }
    });

    return unsubscribe;
  }, []);

  function getImage(userName) {
    if (userName === "Jane Doe") {
      return JaneDoeImage;
    } else if (userName === "John Doe") {
      return JohnDoeImage;
    } else {
      return;
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{ paddingHorizontal: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chevron-back" size={24} color="white" />
            {/* <Text style={{ color: "white", fontSize: 15 }}>Bookings</Text> */}
          </View>
        </Pressable>
        <View style={{ paddingHorizontal: 20, paddingTop: 5 }}>
          <Image
            style={{ width: "100%", height: 250 }}
            source={{ uri: booking.images[0] }}
          ></Image>
        </View>
        <View
          style={{
            backgroundColor: "#333",
            width: "100%",
            height: "100%",
            borderRadius: 30,
            padding: 20,
            gap: 5,
          }}
        >
          <View>
            <Text style={Styles.bookingHeader}>{booking.name}</Text>
            <Text style={{ color: "#999" }}>{booking.license} </Text>
          </View>
          <Text style={{ color: "#666666" }}>Overview</Text>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            <View
              style={{
                backgroundColor: "#fff",
                flex: 1,
                borderRadius: 20,
                padding: 15,
                alignItems: "center",
              }}
            >
              <Ionicons name="speedometer-outline" size={30} color="black" />
              <Text>Horsepower</Text>
              <Text style={{ fontSize: 25 }}>{booking.horsepower}</Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                flex: 1,
                borderRadius: 20,
                padding: 15,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="car-seat" size={30} color="black" />
              <Text>Capacity</Text>
              <Text style={{ fontSize: 25 }}>{booking.seating}</Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                flex: 1,
                borderRadius: 20,
                padding: 15,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="car-turbocharger"
                size={30}
                color="black"
              />
              <Text>Efficiency</Text>
              <Text style={{ fontSize: 25 }}>{booking.efficiency}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#111",
              borderRadius: 20,
              padding: 20,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: 30, color: "#fff" }}>Price</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={{ fontSize: 30, color: "#fff" }}>
                ${booking.price}
              </Text>
              <Text style={{ color: "#999" }}> /week</Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              gap: 20,
            }}
          >
            {/* <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <View flexDirection="row">
                    <Entypo name="info-with-circle" size={24} color="#444" />
                    <Text style={{ fontSize: 20, color: "black" }}>
                      {" "}
                      Owner:{" "}
                    </Text>
                  </View>
                </View>
                <View flexDirection="row" justifyContent="space-evenly">
                  <Text style={{ fontSize: 30, color: "black", padding: 20 }}>
                    {booking.owner.name}
                  </Text>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 50,
                    }}
                    source={getImage(booking.owner.name)}
                  />
                </View>
              </View>
            </View> */}
            <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 50,
                    }}
                    source={getImage(booking.owner.name)}
                  />

                  <View>
                    <Text style={{ padding: 10, fontSize: 25 }}>
                      {booking.owner.name}
                      {"\n"}
                      <Text style={{ fontSize: 14, color: "#666666" }}>
                        Owner
                      </Text>
                    </Text>
                  </View>
                </View>
                <Ionicons name="call" size={24} color="black" />
                <MaterialIcons name="message" size={24} color="black" />
              </View>
            </View>

            <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Ionicons name="today" size={24} color="black" />

                  <Text style={{ fontSize: 20, color: "black" }}>
                    {" "}
                    Date: {booking.bookingDate}
                  </Text>
                </View>
              </View>
            </View>

            <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Entypo name="location-pin" size={24} color="black" />
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {booking.location}
                  </Text>
                </View>
              </View>
            </View>

            <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Entypo name={icon} size={24} color="#444" />
                  <Text style={{ fontSize: 20, color: "black" }}>
                    Status: {booking.status}
                  </Text>
                </View>
              </View>
            </View>

            {showconfirmationNumber ? (
              <View flex="1">
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 15,
                    borderRadius: 20,
                  }}
                >
                  <View flexDirection="row">
                    <Entypo name="key" size={24} color="black" />
                    <Text style={{ fontSize: 20, color: "black" }}>
                      Confirmation #: {booking.confirmation}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
