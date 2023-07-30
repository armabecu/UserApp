import {
    Text,
    StyleSheet,
    View,
    Button,
    SafeAreaView,
    Pressable,
    FlatList,
    Image,
  } from "react-native";
  import Styles from "../Styles";
  import { Ionicons } from "@expo/vector-icons";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { Entypo } from "@expo/vector-icons";
  
  export default function BookingDetail({ route, navigation }) {
    const { booking } = route.params;
  
    return (
      <SafeAreaView>
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
              flexDirection: "row",
              padding: 15,
              gap: 10,
            }}
          >
            <Pressable flex="1">
              <View
                style={{
                  backgroundColor: "#b5b3b3",
                  padding: 25,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Entypo name="cross" size={24} color="#444" />
                  <Text style={{ fontSize: 20, color: "#444" }}>Decline</Text>
                </View>
              </View>
            </Pressable>
            <Pressable flex="1">
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 25,
                  borderRadius: 20,
                }}
              >
                <View flexDirection="row">
                  <Entypo name="check" size={24} color="#444" />
                  <Text style={{ fontSize: 20, color: "black" }}>Approve</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }