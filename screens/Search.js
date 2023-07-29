import { Text, StyleSheet, View } from "react-native";
import Styles from "../Styles";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Search() {

  const isFocused = useIsFocused();

  const [latFromUI, setLatFromUI] = useState("43.676410")
  const [lngFromUI, setLngFromUI] = useState("-79.410150")

  const [city, setCity] = useState("")

  const [marker, setMarkers] = useState([]);

  const getCurrentLocation = async () => {
    try {
      // 1. get permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert(`Permission to access location was denied`)
        return
      }
      // 2. if permission granted, then get the location
      // - The first time, this can take 5-30 seconds to complete
      let location = await Location.getCurrentPositionAsync();

      let newLat = location.coords.latitude
      let newLng = location.coords.longitude

      setLatFromUI(newLat)
      setLngFromUI(newLng)

      const coords = {
        latitude: parseFloat(newLat),
        longitude: parseFloat(newLng),
      }

      const postalAddresses = await Location.reverseGeocodeAsync(coords, {})

      const result = postalAddresses[0]

      if (result === undefined) {
        alert("No results found.")
        return
      }

      let newCity = result.city

      setAndFetchCars(newCity)

    } catch (err) {
      console.log(err)
    }
  }

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
  }


  const getAllCars = async (newCity) => {
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));

      const resultsFromFirestore = []

      for (let doc of querySnapshot.docs) {
        let carCity = await doForwardGeocode(doc.data().location);


        if (carCity == newCity) {
          console.log(`Current City is ${newCity}, Car city is ${carCity}`)

          let markerCoords = await doForwardGeocodeForMarker(doc.data().location)

          const itemToAdd = {
            id: doc.id,
            ...markerCoords
          }


          resultsFromFirestore.push(itemToAdd)


        } else {
          console.log(` WRONG Current City is ${newCity}, Car city is ${carCity}`)

        }
      }

      setMarkers(resultsFromFirestore)


    } catch (err) {
      console.log(err);
    }
  };

  const doForwardGeocode = async (address) => {
    try {
      // 1. Do forward geocode
      const geocodedLocation = await Location.geocodeAsync(address)

      // 2. Check if a matching location is found
      const result = geocodedLocation[0]
      if (result === undefined) {
        alert("No coordinates found")
        return
      }

      const coords = {
        latitude: result.latitude,
        longitude: result.longitude
      }

      let city = await doReverseGeocode(coords)

      return city
    } catch (err) {
      console.log(err)
    }
  }

  const doReverseGeocode = async (coordinates) => {
    try {
      const postalAddresses = await Location.reverseGeocodeAsync(coordinates, {})
      const result = postalAddresses[0]
      if (result === undefined) {
        alert("No results found.")
        return
      }
      return result.city
    } catch (err) {
      console.log(err)
    }
  }

  const doForwardGeocodeForMarker = async (address) => {
    try {
      // 1. Do forward geocode
      const geocodedLocation = await Location.geocodeAsync(address)

      // 2. Check if a matching location is found
      const result = geocodedLocation[0]
      if (result === undefined) {
        alert("No coordinates found")
        return
      }

      const coords = {
        latitude: result.latitude,
        longitude: result.longitude
      }

      return coords

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={Styles.screen}>
      <Text style={{ color: 'white' }}>  Search Screen</Text>
      <MapView
        ref={ref => { mapViewRef = ref; }}
        style={{ height: "50%", width: "100%" }}
        initialRegion={{
          latitude: latFromUI,
          longitude: lngFromUI,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >

        {


          marker.map(
            // this function will run once per item in the MARKERS_ARRAY
            (currMarker, index) => {
              // 1. debug information
              console.log(`Marker Index: ${index}`)
              console.log(currMarker)
              // 2. create coordinate where marker should be displayed
              const coords = {
                latitude: currMarker.latitude,
                longitude: currMarker.longitude
              }
              // 3. define UI for the marker
              return (
                <Marker
                  key={index}
                  coordinate={coords}
                  title={currMarker.name}
                  description={currMarker.desc}
                />
              )
            }
          )
        }






      </MapView>
    </View>
  );
}
