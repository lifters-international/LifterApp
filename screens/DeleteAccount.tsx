import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { AppLayout } from "../components";
import { useSelector } from "react-redux";
import { NavigationProp } from "@react-navigation/native";

import { saveToStore, fetchGraphQl, userPasswordUpdateProps, scale, verticalScale, moderateScale, RequestResult } from "../utils";
import { deleteUserAccount } from "../graphQlQuieries";
import { useAppDispatch } from "../redux";
import { setAuthState } from "../redux/features/auth";

interface Props {
    navigation: NavigationProp<any>;
}

const DeleteAccount: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const deleteAccount = async () => {
        const response = await fetchGraphQl(deleteUserAccount, { email, password })

        if (response.data) {
            if ((response.data as RequestResult).type === "successful") {
                Alert.alert("Account deleted successfully", "Loggin You out now", [
                    {
                        text: "OK",
                        onPress: async () => {
                            await saveToStore("token", "");
                            await saveToStore("username", "");
                            await saveToStore("password", "");
                            dispatch(setAuthState({ token: "", username: "", password: "", tokenVerified: false }));
                        }
                    }
                ]);
            }else {
                Alert.alert("Error", (response.data as RequestResult).value, [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Profiles")
                    }
                ]);
            }
        } return Alert.alert(
            "Issue Deleting Account",
            "Please check your email and password and try again.",
            [
                { text: "OK", onPress: () => navigation.navigate("Profiles") }
            ]);
    }

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>Delete Account</Text>

                <Image
                    source={require("../assets/images/hero-section-line-vector.png")}
                    style={styles.line}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.container}>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />

                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.navigate("Profiles")}>
                        <Text style={{ color: "white", fontSize: moderateScale(15), textAlign: "center" }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonChange} onPress={deleteAccount}>
                        <Text style={{ color: "white", fontSize: moderateScale(15), textAlign: "center" }}>DELETE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "hsl(0, 1%, 13%)",
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "10%",
    },

    Header: {
        padding: moderateScale(10)
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        position: "relative",
        top: moderateScale(20)
    },

    line: {
        height: verticalScale(100),
        width: scale(400),
        zIndex: 1,
        position: "relative",
        top: verticalScale(-50),
    },

    inputView: {
        width: "100%",
        marginBottom: "10%",
        borderWidth: moderateScale(1),
        backgroundColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5)
    },

    input: {
        width: "100%",
        height: verticalScale(40),
        padding: moderateScale(10),
        fontSize: moderateScale(16)
    },

    buttonView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },

    buttonCancel: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        backgroundColor: "#363434",
        padding: moderateScale(10),
        width: "40%"
    },

    buttonChange: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        borderColor: "rgb(60, 151, 255)",
        backgroundColor: "rgb(60, 151, 255)",
        padding: moderateScale(10),
        width: "40%"
    }
})

export default DeleteAccount;
