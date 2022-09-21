import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { AppLayout, BenefitText, Loading } from "../components";

import { useSelector } from "react-redux";

import { NavigationProp } from "@react-navigation/native";

import { PlanType, fetchGraphQl, GraphqlError } from "../utils";

import { subscribeToBasicLifter } from "../graphQlQuieries";

import { useUserSubscriptionInfor } from '../hooks';

import LottieView from 'lottie-react-native';

const Subscription: React.FC = () => {
    const { token } = useSelector((state: any) => state.Auth);
    const { result, loading, error, refresh } = useUserSubscriptionInfor(token);
    const [ refreshState, setRefreshState ] = useState(false);

    useEffect(() => {
        if ( refreshState ) {
            setRefreshState(false);
            refresh();
        }
    }, [refreshState]);

    if ( loading ) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View style={styles.Subscription}>
                <View style={styles.animationFrame}>
                    <LottieView
                        source={require("../assets/LifterNavBar.json")}
                        autoPlay
                        loop
                        speed={0.2}
                    />
                </View>

                <View>
                    <Text style={styles.HeaderText}>Pro Subscription</Text>
                    <View style={styles.TextFrame}>
                        <Text style={styles.text}>$10/month</Text>
                    </View>
                    <ScrollView style={styles.BenfitsTextFrame}>
                        <BenefitText text="Matching" />
                        <BenefitText text="Messaging" />
                        <BenefitText text="No Ads" />
                        <BenefitText text="Searches" />
                        <BenefitText text="Find New Matches" />
                        <BenefitText text="Meal Plans" />
                    </ScrollView>
                </View>

                { 
                    result?.stripeSubscriptionId == PlanType.PRO ? (
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                            fetchGraphQl(subscribeToBasicLifter, { token }).then( result => {
                                if ( result.errors ) {
                                    Alert.alert("Error", "They was a problem changing your subscription. Please try again later.");
                                }else {
                                    setRefreshState(true);
                                }
                            })
                        }}>
                            <Text style={styles.buttonText}>Cancel Subscription</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.buttonSub}>
                            <Text style={styles.buttonText}>Subscribe</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Subscription: {
        padding: 20,
        width: "75%",
        marginRight: "auto",
        marginLeft: "auto"
    },

    animationFrame: {
        height: "40%",
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

    HeaderText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },

    TextFrame: {
        borderWidth: 1,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10,
    },

    text: {
        fontSize: 15,
        textAlign: "center",
    },

    BenfitsTextFrame: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gainsboro",
        padding: 10,
        height: "35%"
    },

    buttonCancel: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "red",
        marginTop: 10,
    },

    buttonText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
        color: "white", 
        fontStyle: "italic"
    },

    buttonSub: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "rgb(69, 156, 255)",
        marginTop: 10,
    }
});

export default Subscription;
