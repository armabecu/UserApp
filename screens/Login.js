import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Styles from "../Styles";
import { auth } from "../firebaseConfig";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // async function loginUser() {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //   } catch (error) {
  //     Alert.alert("Error!", error.message);
  //   }
  // }
  async function loginUser() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const db = getFirestore(firestore);
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists() && userSnapshot.data().user === "renter") {
      } else {
        await auth.signOut();
        Alert.alert("Error!", "You are not authorized to log in.");
      }
    } catch (error) {
      Alert.alert("Error!", error.message);
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#222" }}>
      <View style={Styles.screen}>
        <View
          style={{
            justifyContent: "center",
            flex: 1,
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              Welcome Back!
            </Text>
            <Text
              style={{ color: "gray", alignSelf: "center", paddingBottom: 40 }}
            >
              Please sign in to your account
            </Text>
          </View>
          <View>
            <TextInput
              style={Styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
            ></TextInput>
            <TextInput
              style={Styles.input}
              placeholder="Password"
              placeholderTextColor="#666666"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            ></TextInput>
            <Pressable style={Styles.button} onPress={loginUser}>
              <Text style={{ fontSize: 18, alignSelf: "center" }}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
