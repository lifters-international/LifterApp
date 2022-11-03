import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
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

    if (loadingState) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <View>
                <View style={styles.content}>
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.moto}>CREATE ACCOUNT</Text>

                    <Image
                        source={require("../assets/images/hero-section-line-vector.png")}
                        style={styles.line}
                        resizeMode="contain"
                    />

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons 
                                name="person"
                                size={moderateScale(24)} 
                                color="white" 
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Username"
                                onChangeText={text => setUserState(text)}
                                value={userState}
                                placeholderTextColor="#afadad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons 
                                name="mail"
                                size={moderateScale(24)} 
                                color="white" 
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Email"
                                onChangeText={text => setEmailState(text)}
                                value={emailState}
                                placeholderTextColor="#afadad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Entypo 
                                name="lock"
                                size={moderateScale(24)} 
                                color="white" 
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={{ ...styles.input }}
                                placeholder="Password"
                                onChangeText={text => setPasswordState(text)}
                                value={passwordState}
                                placeholderTextColor="#afadad"
                                secureTextEntry={true}
                            />
                        </View>

                    </View>

                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            bottom: verticalScale(-265),
                            right: scale(-12),
                            width: scale(280),
                            zIndex: 1,
                        }}
                    >
                        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                            <Text style={{ color: "white", fontSize: moderateScale(30) }}>CREATE ACCOUNT</Text>
                            <Feather name="arrow-up-right" size={moderateScale(40)} color="white" style={{ position: "absolute", left: scale(260), top: verticalScale(6) }}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an Account?</Text>
                        <TouchableOpacity onPress={toLoginPage}>
                            <Text style={{ ...styles.footerText, color: "#FF3636" }}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </AppLayout>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: scale(80),
        height: verticalScale(80)
    },

    moto: {
        color: "white",
        fontSize: moderateScale(55),
        width: scale(255),
        zIndex: 1
    },

    line: {
        position: "absolute",
        bottom: 0,
    },

    form: {
        position: "absolute",
        width: scale(300),
        height: verticalScale(250),
        top: verticalScale(270),
        left: scale(20),
    },

    inputContainer: {
        borderBottomWidth: 1,
        borderColor: "white",
        display: "flex",
        flexDirection: "row",
        height: verticalScale(50)
    },

    inputIcon: {
        position: "relative",
        left: scale(10),
        top: verticalScale(13)
    },

    input: {
        width: scale(300),
        fontSize: moderateScale(20),
        color: "white",
        marginLeft: scale(20)
    },

    button: {
        width: scale(300),
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#FF3636",
        display: "flex",
        flexDirection: "row"
    },

    content: {
        padding: "5%",
    },

    footer: {
        position: "absolute",
        bottom: verticalScale(-300),
        right: scale(20),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: scale(300),
    },

    footerText: {
        color: "#afadad",
        fontSize: moderateScale(15),
        marginRight: scale(5)
    }

});

export default SignUp;
