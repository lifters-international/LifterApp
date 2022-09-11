import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, TouchableOpacity } from "react-native";
import LottieView from 'lottie-react-native';

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
                    <View style={styles.animationFrame}>
                        <LottieView
                            source={require("../assets/LifterNavBar.json")}
                            autoPlay
                            loop
                            speed={0.2}
                        />
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.header}>Find your next</Text>
                        </View>
                        <View>
                            <Text style={styles.header}>Gym / Life Partner</Text>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                marginTop: 50,
                            }}
                        >
                            <TouchableOpacity onPress={nextPage} style={styles.button}>
                                <Text style={{color: "white"}}>Get Started</Text>
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
    },
    animationFrame: {
        marginTop: "20%",
        height: "60%",
        alignContent: "center",
        display: "flex",
        alignItems: "center",
    },
    header: {
        
        fontSize: 17.8,
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