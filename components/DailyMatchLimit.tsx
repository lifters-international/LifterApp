import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { moderateScale, verticalScale } from "../utils";

import Logo from "./Logo";

const DailyMatchLimit: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.content}>
            <Text style={styles.text}>Try Again Tomorrow</Text>
                <Text style={{ ...styles.text, color: "#5e5c5c", fontSize: moderateScale(15) }}>Daily Match Limit Has Been Reached</Text>
                <Text style={{ ...styles.text, color: "#5e5c5c", position: "relative", top: verticalScale(100) }}>Upgrade To Get More</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#5e5c5c",
        borderRadius: 10,
        padding: 10,
        width: "95%",
        height: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        top: verticalScale(100),
    },

    logo: {
        width: "30%",
        height: "30%",
        zIndex: -1,
    },

    content: {
        position: "relative",
        top: verticalScale(50),
        alignItems: "center",
    },

    text: {
        color: "white",
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginBottom: verticalScale(10),
    }


});

export default DailyMatchLimit;
