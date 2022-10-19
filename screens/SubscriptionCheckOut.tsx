import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { AppLayout, Loading } from "../components";

import { useSelector } from "react-redux";

import { NavigationProp } from "@react-navigation/native";

import { fetchGraphQl } from "../utils";

import { subscribeToProLifter } from "../graphQlQuieries";

import { useSignedInUserData } from '../hooks';

import { initStripe, CardForm, CardFormView, createToken, createPaymentMethod } from '@stripe/stripe-react-native';


interface Props {
    navigation: NavigationProp<any>;
}

const SubscriptionCheckOut: React.FC<Props> = ({ navigation }) => {
    const [ loading, setLoading ] = useState(true);
    const { token } = useSelector((state: any) => state.Auth);
    const signedInUser = useSignedInUserData(token);
    const [ cardDetails, setCardDetails ] = useState<CardFormView.Details | null>(null);

    useEffect(() => {
        async function init() {
            await initStripe({
                publishableKey: "pk_live_51KLGztATNTHRR4UvZoAjTJTqgnN1i7hnRkTjV7kTf0EViTfLMu6h83OZDFEIFmBtt6TuXiU7vqd5j3jOOHUStcCV00kcz2eBej",
                merchantIdentifier: "merchant.com.lifters",
            });

            setLoading(false);
        }

        init();
    });

    if ( loading || signedInUser.loading ) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>Pro Subscription CheckOut</Text>
            </View>

            <ScrollView
                accessibilityLabel="payment-screen"
                keyboardShouldPersistTaps="handled"
            >
                <CardForm
                    onFormComplete={(cardDetails : CardFormView.Details) => {
                        setCardDetails(cardDetails);
                    }}
                    style={styles.CardForm}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        setLoading(true);

                        if ( !cardDetails ) {
                            Alert.alert("Please fill out the card details");
                            setLoading(false);
                            return;
                        };

                        const token = await createToken({
                            type: "Card",
                            name: signedInUser.data?.username,
                            address: {
                                country: cardDetails.country,
                                postalCode: cardDetails.postalCode
                            },
                            currency: "usd"
                        });

                        if ( token.error ) {
                            Alert.alert("Problem creating subscription. Please try again later.");
                            setLoading(false);
                            return;
                        }

                        const paymentMethod = await createPaymentMethod({
                            paymentMethodType: "Card",
                            paymentMethodData: {
                                token: token.token?.id
                            }
                        });

                        if ( paymentMethod.error ) {
                            Alert.alert("Problem creating subscription. Please try again later.");
                            setLoading(false);
                            return;
                        }

                        const response = await fetchGraphQl(subscribeToProLifter, { token, paymentMethodId: paymentMethod.paymentMethod?.id });

                        setLoading(false);

                        if ( response.errors ) {
                            Alert.alert("Problem creating subscription. Please try again later.");
                            return;
                        }else {
                            navigation.navigate("Subscription");
                        }


                    }}
                >
                    <Text style={styles.buttonText}>Subscribe</Text>
                </TouchableOpacity>
            </ScrollView>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Header: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        padding: 10,
        alignItems: "center"
    },

    HeaderText: {
        fontSize: 20,
        fontWeight: "bold"
    },

    CardForm: {
        height: 200
    },

    button: {
        backgroundColor: "rgb(69, 156, 255)",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: "50%",
        marginTop: 10,
        alignSelf: "center"
    },

    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 20
    }
});

export default SubscriptionCheckOut;
