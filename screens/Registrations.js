import { Text, StyleSheet, View, Button } from "react-native";
import Styles from "../Styles";
import { auth } from "../firebaseConfig";

export default function Registrations() {
  async function signOut() {
    auth.signOut().then(() => console.log("User signed out!"));
  }
  return (
    <View style={Styles.screen}>
      <Text>Registration Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
