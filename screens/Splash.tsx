import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

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
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.logoText}>LIFTERS</Text>

                    <Text style={styles.moto}>HOME FOR ALL GYM PEOPLE</Text>

                    <View>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['#050505', 'rgba(5, 5, 5, 0)']}
                            locations={[0.0, 1.0]}
                            style={styles.fadeOverlay}
                        >
                        </LinearGradient>

                        <View style={styles.fadeOverlayView}>
                            <Image
                                source={require("../assets/images/landing-page-hero-section-man-image.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />

                            <View style={styles.doorEffects}></View>
                        </View>

                        <Image
                            source={require("../assets/images/hero-section-line-vector.png")}
                            style={styles.line}
                            resizeMode="contain"
                        />
                    </View>

                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            bottom: verticalScale(270),
                            right: scale(41.5),
                            width: scale(280),
                            zIndex: 1,
                        }}
                    >
                        <TouchableOpacity onPress={nextPage} style={styles.button}>
                            <Text style={{ color: "white", fontSize: moderateScale(30) }}>GET STARTED</Text>
                            <Feather name="arrow-up-right" size={moderateScale(40)} color="white" style={{ position: "absolute", left: scale(260), top: verticalScale(6) }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: scale(300),
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#FF3636",
        display: "flex",
        flexDirection: "row"
    },

    container: {
        backgroundColor: "black",
        flex: 1,
    },

    content: {
        padding: "5%",

    },

    logo: {
        width: scale(80),
        height: verticalScale(80)
    },

    logoText: {
        color: "#FF3636",
        fontSize: moderateScale(80),
        zIndex: 1
    },

    moto: {
        color: "white",
        fontSize: moderateScale(45),
        zIndex: 1
    },

    image: {
        width: scale(300),
        height: verticalScale(300),
        zIndex: -1,
        position: "relative",
        top: verticalScale(50),
    },

    fadeOverlay: {
        position: "absolute",
        top: verticalScale(30),
        left: scale(-40),
        width: scale(400),
        height: verticalScale(350),
        zIndex: 1,
        transform: [{ rotate: "180deg" }],
    },

    fadeOverlayView: {
        position: "relative",
        top: verticalScale(0),
        left: scale(0),
        zIndex: -1,
    },

    doorEffects: {
        width: scale(300),
        height: verticalScale(300),
        backgroundColor: "#FF3636",
        position: "relative",
        bottom: verticalScale(250),
        borderTopLeftRadius: moderateScale(500),
        borderTopRightRadius: moderateScale(500),
        zIndex: -2
    },

    line: {
        width: scale(300),
        height: verticalScale(300),
        position: "absolute",
        bottom: verticalScale(360),
        zIndex: 3
    }

});


export default Splash;
