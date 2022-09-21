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
        height: "55%",
        alignContent: "center",
        display: "flex",
        alignItems: "center",
        shadowRadius: 10,
        shadowOpacity: 10,
        shadowOffset: {
            width: 20,
            height: 10
        }
    },

    Liftersheader: {
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        color: "red",
        outlineColor: "black",
        fontStyle: "italic"
    },

    header: {
        fontSize: 17.8,
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