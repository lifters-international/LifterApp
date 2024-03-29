import React, { useRef, useEffect } from "react";
import Lottie from 'lottie-react-native';

import { View, StyleSheet } from "react-native";

const Loading: React.FC = () => {
    const animation = useRef<Lottie>(null);
    
    useEffect(() => {
        animation.current?.play();
    }, []);

    return (
        <View style={styles.container}>
            <Lottie
                source={require("../assets/loading.json")}
                loop
                autoPlay
                speed={1}
                ref={animation}
                style={{
                    position: "absolute"
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        display: "flex",
        alignItems: "center",
        height: "100%",
    }
});

export default Loading;