import Lottie from 'lottie-react-native';
import React from "react";

import { View, StyleSheet } from "react-native";

const Loading: React.FC = () => {
    return (
        <View style={styles.container}>
            <Lottie
                animationData={require("../assets/loading.json")}
                loop
                speed={1}
                play
                className="lottie-loading"
            ></Lottie>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: "-12%",
        left: "20%"
    }
});

export default Loading;