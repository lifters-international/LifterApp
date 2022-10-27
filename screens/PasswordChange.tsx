import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { AppLayout } from "../components";
import { useSelector } from "react-redux";
import { NavigationProp } from "@react-navigation/native";

import { saveToStore, fetchGraphQl, userPasswordUpdateProps, scale, verticalScale, moderateScale } from "../utils";
import { updateUserPassword } from "../graphQlQuieries";
import { useAppDispatch } from "../redux";
import { setAuthState } from "../redux/features/auth";

interface Props {
    navigation: NavigationProp<any>;
}

const PasswordChange: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { token, username, password } = useSelector((state: any) => state.Auth);
    const [passwordState, setPassword] = useState<userPasswordUpdateProps>({
        oldPassword: "",
        newPassword: "",
    });

    const handChangePassword = async () => {
        const response = await fetchGraphQl(updateUserPassword, { ...passwordState } )
        
        if ( response.data ) {
            await saveToStore("password", passwordState.newPassword || password);
            dispatch( setAuthState({ token, username, password: passwordState.newPassword || password, tokenVerified: true }) );
            Alert.alert("Password changed successfully");
            navigation.navigate("Profiles");
        }else {
            Alert.alert("Error", "An error occurred while updating your password, please try again.");
        }
    }

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>Change Password</Text>
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
                        placeholder="Old Password"
                        onChangeText={(text) => setPassword({ ...passwordState, oldPassword: text })}
                        value={passwordState.oldPassword}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        onChangeText={(text) => setPassword({ ...passwordState, newPassword: text })}
                        value={passwordState.newPassword}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.navigate("Profiles")}>
                        <Text style={{ color: "white", fontSize: moderateScale(15), textAlign: "center" }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonChange} onPress={handChangePassword}>
                        <Text style={{ color : "white", fontSize: moderateScale(15), textAlign: "center" }}>Change</Text>
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

export default PasswordChange;
