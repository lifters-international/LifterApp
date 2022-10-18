import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import LottieView from 'lottie-react-native';
import { Loading, AppLayout } from "../components";
import { useAppDispatch } from "../redux";
import { logIn, LoginAsyncThunkResult, setAuthState } from "../redux/features/auth";
import { saveToStore, scale, verticalScale, moderateScale } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const LogIn: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const [userState, setUserState] = useState<string>("");
    const [passwordState, setPasswordState] = useState<string>("");
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const handleLogIn = async () => {
        if (userState.length < 1 || passwordState.length < 1) {
            Alert.alert("Error", "Please fill all the fields");
            return;
        }

        setLoadingState(true);
        const resultAction = await dispatch(logIn({ username: userState, password: passwordState }));

        if ((resultAction.payload as LoginAsyncThunkResult).successfull) {
            const token = (resultAction.payload as LoginAsyncThunkResult).data;
            setLoadingState(false);
            await saveToStore("token", token as string);
            await saveToStore("username", userState);
            await saveToStore("password", passwordState);
            dispatch(setAuthState({
                token: token as string,
                tokenVerified: true,
                username: userState,
                password: passwordState
            }));
        } else {
            setLoadingState(false);
            Alert.alert("Error", "Invalid credentials");
        }
        setLoadingState(false);
    }

    const signUpPage = () => {
        navigation.navigate("SignUp");
    }

    if (loadingState) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View>
                {
                    loadingState ? <Loading /> : null
                }
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
                        <Text style={styles.accountTitle}>Login To Account</Text>
                        <View>
                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Username:"
                                onChangeText={text => setUserState(text)}
                                value={userState}
                            />

                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Password:"
                                onChangeText={text => setPasswordState(text)}
                                value={passwordState}
                                secureTextEntry={true}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{ ...styles.button, backgroundColor: "green" }}
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
        marginTop: moderateScale(280),
        justifyContent: "center",
        alignItems: "center",
    },
});

export default LogIn;