import React, { useState, useEffect, useRef } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { AppLayout, BenefitText, Loading } from "../components";

import { useSelector } from "react-redux";

import { NavigationProp } from "@react-navigation/native";

import { PlanType, fetchGraphQl, scale, verticalScale, moderateScale } from "../utils";

import { subscribeToBasicLifter } from "../graphQlQuieries";

import { useUserSubscriptionInfor } from '../hooks';

import LottieView from 'lottie-react-native';

interface Props {
    navigation: NavigationProp<any>;
}

const Subscription: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { result, loading, error, refresh } = useUserSubscriptionInfor(token);
    const [refreshState, setRefreshState] = useState(false);

    useEffect(() => {
        if (refreshState) {
            setRefreshState(false);
            refresh();
        }
    }, [refreshState]);

    if (loading) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View style={styles.Subscription}>
                <LottieView
                    source={require("../assets/LifterNavBar.json")}
                    autoPlay
                    loop
                    speed={0.2}
                    style={styles.animation}
                    resizeMode="cover"
                />

                <View style={styles.SubscriptionFrame}>
                    <Text style={styles.HeaderText}>Pro Subscription</Text>
                    <View style={styles.TextFrame}>
                        <Text style={styles.text}>$6.99/month</Text>
                    </View>
                    <ScrollView style={styles.BenfitsTextFrame}>
                        <BenefitText text="15 Matches A Day" />
                        <BenefitText text="Messaging" />
                        <BenefitText text="Ads" />
                        <BenefitText text="Searches" />
                        <BenefitText text="Find New Matches" />
                        <BenefitText text="Food Analytics" />
                    </ScrollView>

                    {
                        result?.stripeSubscriptionId == PlanType.PRO ? (
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                                fetchGraphQl(subscribeToBasicLifter, { token }).then(result => {
                                    if (result.errors) {
                                        Alert.alert("Error", "They was a problem changing your subscription. Please try again later.");
                                    } else {
                                        setRefreshState(true);
                                    }
                                })
                            }}>
                                <Text style={styles.buttonText}>Cancel Subscription</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.buttonSub} onPress={() => navigation.navigate("Subscription CheckOut")}>
                                <Text style={styles.buttonText}>Subscribe</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Subscription: {
        padding: moderateScale(20),
        width: "75%",
        marginRight: "auto",
        marginLeft: "auto"
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
        bottom: verticalScale(50),
        left: scale(-18),
    },

    SubscriptionFrame: {
        position: "relative",
        bottom: verticalScale(-200),
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        textAlign: "center",
    },

    TextFrame: {
        borderWidth: moderateScale(1),
        borderColor: "gainsboro",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
    },

    text: {
        fontSize: moderateScale(15),
        textAlign: "center",
    },

    BenfitsTextFrame: {
        marginTop: moderateScale(10),
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        borderColor: "gainsboro",
        padding: moderateScale(10),
        height: verticalScale(175)
    },

    buttonCancel: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: "red",
        marginTop: moderateScale(10),
    },

    buttonText: {
        textAlign: "center",
        fontSize: moderateScale(15),
        fontWeight: "bold",
        color: "white",
        fontStyle: "italic"
    },

    buttonSub: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: "rgb(69, 156, 255)",
        marginTop: moderateScale(10),
    }
});

export default Subscription;
