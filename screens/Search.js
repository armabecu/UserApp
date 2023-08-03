import {
  Text,
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Styles from "../Styles";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Search() {
  const [latFromUI, setLatFromUI] = useState("0");
  const [lngFromUI, setLngFromUI] = useState("0");
  const [city, setCity] = useState("");
  const [marker, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const getCurrentLocation = async () => {
    try {
      // 1. get permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(`Permission to access location was denied`);
        return;
      }
      // 2. if permission granted, then get the location
      // - The first time, this can take 5-30 seconds to complete
      let location = await Location.getCurrentPositionAsync();

      let newLat = location.coords.latitude;
      let newLng = location.coords.longitude;

      setLatFromUI(newLat);
      setLngFromUI(newLng);

      const coords = {
        latitude: parseFloat(newLat),
        longitude: parseFloat(newLng),
      };

      const postalAddresses = await Location.reverseGeocodeAsync(coords, {});

      const result = postalAddresses[0];

      if (result === undefined) {
        alert("No results found.");
        return;
      }

      let newCity = result.city;

      setAndFetchCars(newCity);
    } catch (err) {
      console.log(err);
    }
  };

  // Call getCurrentLocation once when the component is mounted
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // useEffect(() => {
  //   // Call getCurrentLocation when the screen gains focus
  //   if (isFocused) {
  //     getCurrentLocation();
  //   }
  // }, [isFocused]);

  // useEffect(() => {
  //   console.log(marker);
  // }, [marker]);

  const setAndFetchCars = async (newCity) => {
    setCity(newCity);
    // Ensure the city state is updated before fetching the cars
    await getAllCars(newCity);
  };

  const getAllCars = async (newCity) => {
    try {
      const querySnapshot = await getDocs(collection(db, "owners"));

      const resultsFromFirestore = [];

      for (let ownerDoc of querySnapshot.docs) {
        const ownerID = ownerDoc.id;

        const carsSnapshot = await getDocs(
          collection(db, "owners", ownerID, "listings")
        );

        for (let carDoc of carsSnapshot.docs) {
          let carCity = await doForwardGeocode(carDoc.data().location);

          if (carCity == newCity) {
            console.log(`Current City is ${newCity}, Car city is ${carCity}`);

            let markerCoords = await doForwardGeocodeForMarker(
              carDoc.data().location
            );

            const ownerInfo = {
              id: ownerID,
              name: ownerDoc.data().name,
            };

            const itemToAdd = {
              id: carDoc.id,
              ...markerCoords,
              efficiency: carDoc.data().efficiency,
              horsepower: carDoc.data().horsepower,
              license: carDoc.data().license,
              name: carDoc.data().name,
              price: carDoc.data().price,
              range: carDoc.data().range,
              seating: carDoc.data().seating,
              location: carDoc.data().location,
              images: carDoc.data().images.map((imageObj) => imageObj.url_full),
              owner: ownerInfo,
              status: carDoc.data().status,
              bookingDate: carDoc.data().bookingDate,
              confirmation: carDoc.data().confirmation,
            };

            resultsFromFirestore.push(itemToAdd);
          } else {
            console.log(
              ` WRONG Current City is ${newCity}, Car city is ${carCity}`
            );
          }
        }
      }

      setMarkers(resultsFromFirestore);
    } catch (err) {
      console.log(err);
    }
  };

  const doForwardGeocode = async (address) => {
    try {
      // 1. Do forward geocode
      const geocodedLocation = await Location.geocodeAsync(address);

      // 2. Check if a matching location is found
      const result = geocodedLocation[0];
      if (result === undefined) {
        alert("No coordinates found");
        return;
      }

      const coords = {
        latitude: result.latitude,
        longitude: result.longitude,
      };

      let city = await doReverseGeocode(coords);

      return city;
    } catch (err) {
      console.log(err);
    }
  };

  const doReverseGeocode = async (coordinates) => {
    try {
      const postalAddresses = await Location.reverseGeocodeAsync(
        coordinates,
        {}
      );
      const result = postalAddresses[0];
      if (result === undefined) {
        alert("No results found.");
        return;
      }
      return result.city;
    } catch (err) {
      console.log(err);
    }
  };

  const doForwardGeocodeForMarker = async (address) => {
    try {
      // 1. Do forward geocode
      const geocodedLocation = await Location.geocodeAsync(address);

      // 2. Check if a matching location is found
      const result = geocodedLocation[0];
      if (result === undefined) {
        alert("No coordinates found");
        return;
      }

      const coords = {
        latitude: result.latitude,
        longitude: result.longitude,
      };

      return coords;
    } catch (err) {
      console.log(err);
    }
  };

  //Function to handle marker press and show modal
  const handleMarkerPress = (markerData) => {
    setSelectedMarker(markerData);
    setModalVisible(true);
  };

  // Function to hide the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedMarker(null);
  };

  const bookNow = async () => {
    const authUser = getAuth().currentUser;

    let futureDate = new Date();
    futureDate.setDate(
      futureDate.getDate() + Math.floor(Math.random() * 365) + 1
    );

    const year = futureDate.getFullYear();
    const month = futureDate.getMonth() + 1; // Months are 0-based, so add 1
    const date = futureDate.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;

    if (authUser != null) {
      const bookingToAdd = {
        name: selectedMarker.name,
        license: selectedMarker.license,
        location: selectedMarker.location,
        seating: selectedMarker.seating,
        efficiency: selectedMarker.efficiency,
        range: selectedMarker.efficiency,
        price: selectedMarker.price,
        status: "Needs Approval",
        images: selectedMarker.images,
        horsepower: selectedMarker.horsepower,
        owner: selectedMarker.owner,
        bookingDate: formattedDate,
        confirmation: "",
      };

      const renter = {
        id: authUser.uid,
        email: authUser.email,
      };
      try {
        await setDoc(
          doc(
            collection(db, "renters", authUser.uid, "bookings"),
            selectedMarker.id
          ),
          bookingToAdd
        );

        await updateDoc(
          doc(
            collection(db, "owners", selectedMarker.owner.id, "listings"),
            selectedMarker.id
          ),
          {
            status: "Needs Approval",
            bookingDate: futureDate,
            renterInfo: renter,
          }
        );

        alert(
          "Added to Bookings list, you need to wait for owner confirmation"
        );
        setModalVisible(false);
      } catch (error) {
        alert("Error!", error.message);
        console.log(error);
      }
    } else {
      // handle case when user is not logged in
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ height: "100%", width: "100%" }}
        region={{
          latitude: parseFloat(latFromUI),
          longitude: parseFloat(lngFromUI),
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {marker.map((currMarker, index) => {
          const coords = {
            latitude: currMarker.latitude,
            longitude: currMarker.longitude,
          };
          return (
            <Marker
              key={index}
              coordinate={coords}
              //title={currMarker.name}
              description={currMarker.desc}
              onPress={() => handleMarkerPress(currMarker)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 50,
                }}
              >
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  ${currMarker.price}
                </Text>
              </View>
            </Marker>
          );
        })}

      </MapView>

      <TouchableOpacity style={{
        position: 'absolute',
        top: 80,
        right: 10,
        padding: 10,
        borderRadius: 5,
      }}onPress={getCurrentLocation}>
        <Ionicons name="refresh-circle" size={50} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {selectedMarker && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <View style={{ paddingLeft: 15, paddingTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMarker.name}
                  </Text>
                  <Text>{selectedMarker.license}</Text>
                </View>
                <Image
                  style={{ width: "45%", height: 110 }}
                  source={{ uri: selectedMarker.images[0] }}
                ></Image>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingBottom: 10,
                  paddingLeft: 15,
                }}
              >
                Overview
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    flex: 1,
                    borderRadius: 20,
                    padding: 15,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="speedometer-outline"
                    size={30}
                    color="black"
                  />
                  <Text>Horsepower</Text>
                  <Text style={{ fontSize: 20 }}>
                    {selectedMarker.horsepower}
                  </Text>
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
                    name="car-seat"
                    size={30}
                    color="black"
                  />
                  <Text>Capacity</Text>
                  <Text style={{ fontSize: 20 }}>{selectedMarker.seating}</Text>
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
                  <Text style={{ fontSize: 20 }}>
                    {selectedMarker.efficiency}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 20,
                    alignItems: "baseline",
                  }}
                >
                  <Text style={{ fontSize: 35, fontWeight: "bold" }}>
                    ${selectedMarker.price}
                  </Text>
                  <Text style={{ color: "#999", fontSize: 20 }}>/week</Text>
                </View>
                <Pressable onPress={bookNow}>
                  <View
                    style={{
                      backgroundColor: "#111",
                      paddingVertical: 20,
                      borderRadius: 40,
                      paddingHorizontal: 50,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Book Now
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    // alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "100%",
    height: "50%",
    backgroundColor: "#F7F7F7",
    padding: 10,
    gap: 7,
    shadowColor: "#111",
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    borderRadius: 20,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonContainer: {
    position: 'absolute', 
    bottom: 10, 
    left: 10, 
  },
});
