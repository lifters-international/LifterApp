import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AppLayout } from "../components";
import { useSelector } from "react-redux";
import { NavigationProp } from "@react-navigation/native";

import { saveToStore, fetchGraphQl, userPasswordUpdateProps } from "../utils";
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
        <AppLayout>
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
                        <Text style={{ color: "black", fontSize: 15, textAlign: "center" }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonChange} onPress={handChangePassword}>
                        <Text style={{ color : "white", fontSize: 15, textAlign: "center" }}>Change</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "gainsboro",
        padding: 10,
        borderRadius: 10,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "40%",
    },

    inputView: {
        width: "100%",
        marginBottom: "10%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        padding: 5
    },

    input: {
        width: "100%",
        height: 40,
        padding: 10,
        fontSize: 16
    },

    buttonView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },

    buttonCancel: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gainsboro",
        padding: 10,
        width: "40%",
    },

    buttonChange: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "rgb(60, 151, 255)",
        backgroundColor: "rgb(60, 151, 255)",
        padding: 10,
        width: "40%"
    }
})

export default PasswordChange;
