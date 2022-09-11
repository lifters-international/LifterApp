import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import LottieView from 'lottie-react-native';
import { Loading } from "../components";
import { useAppDispatch } from "../redux";
import { logIn, LoginAsyncThunkResult, setAuthState } from "../redux/features/auth"; 
import { saveToStore } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const LogIn : React.FC<Props> = ( { navigation }) => {
    const dispatch = useAppDispatch();
    const [ userState, setUserState ] = useState<string>("");
    const [ passwordState, setPasswordState ] = useState<string>("");
    const [ loadingState, setLoadingState ] = useState<boolean>(false);

    const handleLogIn = async () => {
        if (userState.length < 1 || passwordState.length < 1) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        setLoadingState(true);
        const resultAction = await dispatch(logIn({ username: userState, password: passwordState }));

        if (( resultAction.payload as LoginAsyncThunkResult).successfull) {
            const token = ( resultAction.payload as LoginAsyncThunkResult).data;
            setLoadingState(false);
            await saveToStore("token",  token as string);
            await saveToStore("username", userState);
            await saveToStore("password", passwordState);
            dispatch(setAuthState({
                token: token as string,
                tokenVerified: true,
                username: userState, 
                password: passwordState
            }));
        }else {
            setLoadingState(false);
            Alert.alert("Error", "Invalid credentials");
        }
        setLoadingState(false);
    }

    const signUpPage = () => {
        navigation.navigate("SignUp");
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                {
                    loadingState ? <Loading /> : null
                }
                <View style={styles.content}>
                    <View style={styles.animationFrame}>
                        <LottieView
                            source={require("../assets/LifterNavBar.json")}
                            autoPlay
                            loop
                            speed={0.2}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.accountTitle}>Login To Account</Text>
                        <View>
                            <TextInput
                                style={{...styles.input}}
                                placeholder="Username:"
                                onChangeText={text => setUserState(text)}
                                value={userState}
                            />

                            <TextInput
                                style={{...styles.input}}
                                placeholder="Password:"
                                onChangeText={text => setPasswordState(text)}
                                value={passwordState}
                                secureTextEntry={true}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{ ...styles.button, backgroundColor: "green"}}
                                onPress={handleLogIn}
                            >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={signUpPage}
                            >
                                <Text style={styles.buttonText}>Don't have an Account? Create One Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    accountTitle: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 20
    },

    buttonText: {
        color: "white",
        textAlign: "center"
    },

    input: {
        width: 300,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10
    },

    button: {
        textAlign: "center",
        width: 300,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "gainsboro",
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "#00bcd4",
        color: "white"
    },

    container: {
        backgroundColor: "white",
        flex: 1,
    },

    content: {
        padding: "5%",
    },

    animationFrame: {
        marginTop: "20%",
        height: "35%",
        alignContent: "center",
        display: "flex",
        alignItems: "center",
    },

    header: {
        fontSize: 17.8,
    },

    footer: {
        width: "100%",
        display: "flex",
        marginTop: "0%",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default LogIn;