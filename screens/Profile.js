import {
    Text,
    StyleSheet,
    View,
    Button,
    SafeAreaView,
    Pressable,
    Image,
} from "react-native";
import Styles from "../Styles";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { collection, setDoc, addDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import AshleySmithImage from "../assets/profile03.png"
import JohnSmithImage from "../assets/profile04.png"




export default function Profile() {
    const [userName, setUserName] = useState("");
    const [Name, setName] = useState("");

    async function signOut() {
        auth.signOut(auth).then(() => console.log("User signed out!"));
    }

    async function getUser() {
        const authUser = getAuth().currentUser;

        if (authUser.email === "ashleysmith@email.com") {

            setUserName("ashleysmith@email.com")
            setName("Ashley Smith")

        } else if (authUser.email === "johnsmith@email.com") {

            setUserName("johnsmith@email.com")
            setName("John Smith")
        }


    }

    useEffect(() => {
        getUser();
    }, []);

    function getImage(userName) {
        if (userName === "ashleysmith@email.com") {
            return AshleySmithImage;
        } else if (userName === "johnsmith@email.com") {
            return JohnSmithImage;
        } else {
            return;
        }
    }

    return (
        <SafeAreaView>
            <View style={Styles.screen}>
                <Text style={Styles.header}>Profile</Text>
                <View style={{ paddingTop: 35 }}>
                    <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                            source={getImage(userName)}
                        />
                        <View>
                            <Text
                                style={{
                                    fontSize: 30,
                                    color: "white",
                                    fontWeight: "bold",
                                    paddingLeft: 40,
                                    paddingTop: 10,
                                }}
                            >
                                {Name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "white",
                                    paddingHorizontal: 45,
                                }}
                            >
                                Renter
                            </Text>
                        </View>
                    </View>
                </View>
                <Button title="Sign Out" onPress={signOut} />
            </View>
        </SafeAreaView>
    );
}
