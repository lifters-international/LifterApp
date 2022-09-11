import React, { useRef, useEffect } from "react";
import Lottie from 'lottie-react-native';

import { View, StyleSheet, StyleProp } from "react-native";

export type LoadingProps = {
    
}

const Logo: React.FC<LoadingProps> = ( {  }) => {
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
        height: "20%",
        alignContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start"
    },

    lottie: {
        width: "30%",
        height: "100%",
    }

});

export default Logo;