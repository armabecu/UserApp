import { Text, StyleSheet, View, Image, Modal, TouchableOpacity, Pressable } from "react-native";
import Styles from "../Styles";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";


export default function Search() {
  const isFocused = useIsFocused();

  const [latFromUI, setLatFromUI] = useState("43.676410");
  const [lngFromUI, setLngFromUI] = useState("-79.410150");

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

  useEffect(() => {
    // Call getCurrentLocation when the screen gains focus
    if (isFocused) {
      getCurrentLocation();
    }
  }, [isFocused]);

  useEffect(() => {
    console.log(marker);
  }, [marker]);

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

            // Extract URLs from the "Images" field
            //const imageUrls = carDoc.data().images.map((imageObj) => imageObj.url_full);

            const itemToAdd = {
              id: carDoc.id,
              ...markerCoords,
              efficiency: carDoc.data().efficiency,
              license: carDoc.data().license,
              name: carDoc.data().name,
              price: carDoc.data().price,
              range: carDoc.data().range,
              seating: carDoc.data().seating,
              images: carDoc.data().images.map((imageObj) => imageObj.url_full)

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

  // const getAllCars = async (newCity) => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "cars"));

  //     const resultsFromFirestore = []

  //     for (let doc of querySnapshot.docs) {
  //       let carCity = await doForwardGeocode(doc.data().location);

  //       if (carCity == newCity) {
  //         console.log(`Current City is ${newCity}, Car city is ${carCity}`)

  //         let markerCoords = await doForwardGeocodeForMarker(doc.data().location)

  //         const itemToAdd = {
  //           id: doc.id,
  //           ...markerCoords
  //         }

  //         resultsFromFirestore.push(itemToAdd)

  //       } else {
  //         console.log(` WRONG Current City is ${newCity}, Car city is ${carCity}`)

  //       }
  //     }

  //     setMarkers(resultsFromFirestore)

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  return (

    <View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={{
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
              title={currMarker.name}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMarker && (
              <View>
                <Image
                  style={{ width: "100%", height: 250 }}
                  source={{ uri: selectedMarker.images[0]}}
                ></Image>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {selectedMarker.name}
                </Text>
                <Text>Description: {selectedMarker.desc}</Text>
                <Text>Price: ${selectedMarker.price}</Text>
                {/* Add more details as needed */}
                <Pressable onPress={closeModal} style={styles.closeButton}>
                  <Text style={{ color: "white" }}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "90%",
    backgroundColor: "#222",
    padding: 10,
    //alignItems: "center",
    shadowColor: "#111",
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    borderRadius: 10,
   
    
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
});

