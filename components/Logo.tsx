import React, { useRef, useEffect } from "react";
import Lottie from 'lottie-react-native';

import { View, StyleSheet } from "react-native";

import { moderateScale } from "../utils";

const Logo: React.FC = () => {
    const animation = useRef<Lottie>(null);

    useEffect(() => {
        animation.current?.play();
    }, []);

    return (
        <View style={styles.container}>
            <Lottie
                source={require("../assets/LifterNavBar.json")}
                loop
                ref={animation}
                autoPlay
                speed={0.2}
                style={styles.lottie}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "10%",
        alignContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        borderBottomWidth: moderateScale(1),
        borderColor: "gainsboro",
        padding: moderateScale(10),
        marginBottom: moderateScale(14)
    },

    lottie: {
        width: "30%",
        height: "100%",
    }

});

export default Logo;