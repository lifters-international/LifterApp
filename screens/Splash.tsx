import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";

import LottieView from 'lottie-react-native';

import { scale, verticalScale, moderateScale } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const Splash: React.FC<Props> = ({ navigation }) => {
    const nextPage = () => {
        navigation.navigate("SignUp");
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.content}>
                    <LottieView
                        source={require("../assets/LifterNavBar.json")}
                        autoPlay
                        loop
                        speed={0.2}
                        style={styles.animation}
                        resizeMode="cover"
                    />
                    <View>
                        <Text style={styles.Liftersheader}>LIFTERS</Text>
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.header}>#1</Text>
                        </View>
                        <View>
                            <Text style={styles.header}>HOME FOR ALL THINGS GYM</Text>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                marginTop: moderateScale(50),
                            }}
                        >
                            <TouchableOpacity onPress={nextPage} style={styles.button}>
                                <Text style={{ color: "white", fontSize: moderateScale(30) }}>Get Started</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "red"
    },

    container: {
        backgroundColor: "white",
        flex: 1,
    },

    content: {
        padding: "5%",
        marginTop: moderateScale(400)
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
        bottom: moderateScale(100),
    },

    Liftersheader: {
        fontSize: moderateScale(40),
        fontWeight: "bold",
        textAlign: "center",
        color: "red",
        outlineColor: "black",
        fontStyle: "italic"
    },

    header: {
        fontSize: moderateScale(17.8),
        fontWeight: "bold",
        color: "red"
    },

    footer: {
        width: "100%",
        display: "flex",
        marginTop: "0%",
        justifyContent: "center",
        alignItems: "center",
    },
});


export default Splash;
