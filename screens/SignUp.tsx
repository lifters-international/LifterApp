import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import LottieView from 'lottie-react-native';
import { Loading, AppLayout } from "../components";
import { useAppDispatch } from "../redux";
import { logIn, signUp, SignUpAsyncThunkResult, LoginAsyncThunkResult, setAuthState } from "../redux/features/auth";
import { saveToStore } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const SignUp: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const [userState, setUserState] = useState("");
    const [emailState, setEmailState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const handleSignUp = async () => {
        if (userState.length < 1 || emailState.length < 1 || passwordState.length < 1) {
            Alert.alert("Error", "Please fill out all fields");
            return
        }

        setLoadingState(true);
        const signUpResult = await dispatch(signUp({ email: emailState, password: passwordState, username: userState }));

        if ((signUpResult.payload as SignUpAsyncThunkResult).successfull) {
            Alert.alert("Accounted Created", "Loggining you in.");
            const loginResult = await dispatch(logIn({ username: userState, password: passwordState }));

            if ((loginResult.payload as LoginAsyncThunkResult).successfull) {
                await saveToStore("token", ((loginResult.payload as LoginAsyncThunkResult).data as string));
                await saveToStore("username", userState);
                await saveToStore("password", passwordState);
                dispatch(setAuthState({
                    token: ((loginResult.payload as LoginAsyncThunkResult).data as string),
                    tokenVerified: true,
                    username: userState,
                    password: passwordState
                }));
            } else {
                //console.log("LoginResult", (loginResult.payload as LoginAsyncThunkResult).errors);
            }
        } else {
            if ((signUpResult.payload as SignUpAsyncThunkResult).errors[0].message === "Username Already exist") {
                Alert.alert("Error", "Username already exist");
            } else {
                Alert.alert("Error", "Something went wrong, please try again");
            }
        }

        setLoadingState(false);
    }

    const toLoginPage = () => {
        navigation.navigate('Login');
    }


    return (
        <AppLayout>
            <View style={styles.container}>
                {
                    loadingState ? <Loading /> : null
                }
                <View style={styles.content}>
                    <View style={styles.animationFrame}>
                        <LottieView
                            source={require("../assets/LifterNavBar.json")}
                            autoPlay
                            loop
                            play
                            speed={0.2}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.accountTitle}>Create Account</Text>
                        <View>
                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Username:"
                                onChangeText={text => setUserState(text)}
                                value={userState}
                            />

                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Email:"
                                onChangeText={text => setEmailState(text)}
                                value={emailState}
                            />

                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Password"
                                onChangeText={text => setPasswordState(text)}
                                value={passwordState}
                                secureTextEntry={true}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{ ...styles.button, backgroundColor: "green" }}
                                onPress={handleSignUp}
                            >
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={toLoginPage}
                            >
                                <Text style={styles.buttonText}>Already have an Account? Login Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </AppLayout>
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
        height: "30%",
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

export default SignUp;