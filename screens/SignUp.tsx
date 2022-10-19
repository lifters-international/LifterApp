import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import LottieView from 'lottie-react-native';
import { Loading, AppLayout } from "../components";
import { useAppDispatch } from "../redux";
import { logIn, signUp, SignUpAsyncThunkResult, LoginAsyncThunkResult, setAuthState } from "../redux/features/auth";
import { saveToStore, scale, verticalScale, moderateScale } from "../utils";

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

    if ( loadingState ) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View>
                <View style={styles.content}>
                    <LottieView
                        source={require("../assets/LifterNavBar.json")}
                        autoPlay
                        loop
                        speed={0.2}
                        style={styles.animation}
                        resizeMode="cover"
                    />
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
        fontSize: moderateScale(30),
        fontWeight: "bold",
    },

    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: moderateScale(20)
    },

    input: {
        width: scale(300),
        marginBottom: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: "gainsboro",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        fontSize: moderateScale(20)
    },

    button: {
        textAlign: "center",
        width: scale(300),
        marginBottom: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: "gainsboro",
        borderRadius: moderateScale(5),
        padding: moderateScale(10),
        fontSize: moderateScale(25),
        fontWeight: "bold",
        backgroundColor: "#00bcd4",
        color: "white"
    },

    content: {
        padding: "5%",
    },

    animation: {
        width: scale(350),
        height: verticalScale(210),
        padding: scale(10),
        borderRadius: moderateScale(50),
        display: "flex",
        shadowRadius: moderateScale(10),
        shadowOpacity: moderateScale(10),
        shadowOffset: {
            width: moderateScale(20),
            height: moderateScale(10)
        },
        position: "absolute",
        top: moderateScale(20),
    },

    header: {
        fontSize: moderateScale(17.8),
    },

    footer: {
        width: "100%",
        display: "flex",
        marginTop: moderateScale(275),
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SignUp;
