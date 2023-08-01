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
import { Entypo } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import JaneDoeImage from "../assets/profile.png";
import JohnDoeImage from "../assets/profile02.png";

export default function BookingDetail({ route, navigation }) {
  const { booking } = route.params;

  const [showconfirmationNumber, setshowconfirmationNumber] = useState(false);

  const [icon, seticon] = useState("hour-glass");

  useEffect(() => {

    if (booking.status == "Declined") {
      seticon("circle-with-cross")
    } else if (booking.status == "Approved") {
      seticon("check")
    }

    if (booking.status == "Approved") {
      setshowconfirmationNumber(true)
    }



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
            <Text style={{ fontSize: 30, color: "#fff" }}>${booking.price}</Text>
          </View>

          <View
            style={{
              padding: 15,
              gap: 10
            }}
          >


            <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row" gap="40">
                  <View flexDirection="row">
                  <Entypo name="info-with-circle" size={24} color="#444" />
                  <Text style={{ fontSize: 20, color: "black" }}> Owner: </Text>
                  </View>
                  <View >
                    <Text style={{ fontSize: 20, color: "black" }}>{booking.owner.name}</Text>
                    <Image
                      style={{ width: 80, height: 80, borderRadius: 50 }}
                      source={getImage(booking.owner.name)}
                    />
                  </View>
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
                  <Ionicons name="today" size={24} color="black" />

                  <Text style={{ fontSize: 20, color: "black" }}> Date: {booking.bookingDate}</Text>
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
                  <Text style={{ fontSize: 20, color: "black" }}>{booking.location}</Text>
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
                  <Text style={{ fontSize: 20, color: "black" }}>Status: {booking.status}</Text>
                </View>
              </View>
            </View>

            {showconfirmationNumber ? <View flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Entypo name="key" size={24} color="black" />
                  <Text style={{ fontSize: 20, color: "black" }}>Confirmation #: {booking.confirmation}</Text>
                </View>

              </View>
            </View> : null}
          </View>





        </View>
      </ScrollView>
    </SafeAreaView>
  );
}