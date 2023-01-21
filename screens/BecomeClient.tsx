import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Loading, AppLayout, Button } from "../components";
import { useUserIsClient } from "../hooks";
import { returnImageSource, fetchGraphQl, scale, moderateScale, verticalScale } from "../utils";
import { createTrainerClient, becomeClientSubSecrets } from "../graphQlQuieries";

import { useConfirmSetupIntent, CardForm } from '@stripe/stripe-react-native';

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const styles = StyleSheet.create({
    Container: {
        width: scale(330),
        height: verticalScale(570),
        backgroundColor: "#181717",
        borderRadius: moderateScale(10),
        padding: moderateScale(20),
        marginTop: verticalScale(3),
        marginRight: "auto",
        marginLeft: "auto"
    },

    banner: {
        width: scale(300),
        height: verticalScale(180),
        borderRadius: moderateScale(10)
    },

    profilePicture: {
        borderRadius: moderateScale(50),
        padding: moderateScale(10),
        position: "relative",
        top: verticalScale(-52)
    },

    NameCost: {
        position: "relative",
        top: verticalScale(-35),
        left: scale(-14)
    },

    name: {
        color: "rgb(131, 130, 130)",
        fontSize: moderateScale(20),
        textAlign: "center"
    },

    cost: {
        display: "flex",
        position: "relative",
        top: verticalScale(-22),
        left: scale(258)
    },

    price: {
        color: "rgb(95, 180, 95)"
    },

    month: {
        fontSize: moderateScale(10),
        position: "relative",
        top: verticalScale(-14),
        left: scale(27)
    },

    benefitContainer: {
        position: "relative",
        top: verticalScale(-35)
    },

    benefit: {
        borderWidth: moderateScale(1),
        borderColor: "rgb(87, 86, 86)",
        width: "90%",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginRight: "auto",
        marginLeft: "auto",
        textAlign: "center",
        fontSize: moderateScale(20),
        marginTop: moderateScale(5),
        marginBottom: moderateScale(5),
        color: "rgb(83, 83, 83)"
    }
});

const BecomeClient: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { trainer, redirectTab } = route.params as { trainer: string, redirectTab?: string };
    const userIsClient = useUserIsClient(trainer, token);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [subscriptionOpen, setSubscriptionOpen] = useState(false);
    const [goTrainers, setGoTrainers] = useState(false);

    const [subSecrets, setSubSecrets] = useState("");
    const [ cardErrorStatement, setCardErrorStatement] = useState("");

    const { confirmSetupIntent, loading: ConfirmSetupLoading } = useConfirmSetupIntent();

    useEffect(() => {
        if (subscriptionOpen) fetchGraphQl(becomeClientSubSecrets, { token, trainerId: trainer })
            .then(res => {
                if (res.errors) {
                    console.log(res.errors);
                    setError(true);
                } else {
                    setSubSecrets(res.data.becomeClientSubSecrets.clientSecret);
                }

                setLoading(false);
            })
    }, [subscriptionOpen]);

    useEffect(() => {
        if ( userIsClient.data?.clientExist ) setGoTrainers(true);
    }, [userIsClient.data])

    useEffect(() => {
        if (goTrainers) navigation.navigate("Trainers", { open: redirectTab || "settings", client: userIsClient.data?.clientId });
    });

    if (userIsClient.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if (goTrainers) {
        return <AppLayout backgroundColor="black"><></></AppLayout>
    }

    return (
        <AppLayout backgroundColor="black">
            {
                !subscriptionOpen ? (
                    <ScrollView style={styles.Container}>
                        <View>
                            <Image source={returnImageSource(userIsClient.data?.banner!)} style={styles.banner} resizeMode="stretch" />
                            <Image source={returnImageSource(userIsClient.data?.profilePicture!)} style={styles.profilePicture} resizeMode="stretch" />
                        </View>

                        <View style={styles.NameCost}>
                            <Text style={styles.name}>Become {userIsClient.data?.name}'s client</Text>

                            <View style={styles.cost}>
                                <Text style={styles.price}>${userIsClient.data?.price}/</Text>
                                <Text style={{ ...styles.price, ...styles.month }}>month</Text>
                            </View>
                        </View>

                        <View style={styles.benefitContainer}>
                            <Text style={{ textAlign: "center", position: "relative", top: verticalScale(-6), color: "#5e5c5c" }}>Benefits</Text>

                            <View style={{ borderTopWidth: moderateScale(1), borderTopColor: "rgb(87, 87, 87)" }}>
                                <Text style={styles.benefit}>Messaging</Text>
                                <Text style={styles.benefit}>Booking Sessions</Text>
                                <Text style={styles.benefit}>Access to client only videos</Text>
                            </View>
                        </View>

                        <Text style={{ textAlign: "center", position: "relative", top: verticalScale(-25), fontStyle: "italic", color: "rgb(114, 114, 114)" }}>Contact {userIsClient.data?.name} at {userIsClient.data?.email} for any questions.</Text>

                        <Button
                            style={{ position: "relative", top: verticalScale(-10), marginRight: "auto", marginLeft: "auto", backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                            textStyle={{ color: "white" }}
                            title={loading ? 'Loading' : `Become ${userIsClient.data?.name}'s Client`}
                            onPress={
                                () => {
                                    if (userIsClient.data?.hasDefaultPaymentMethod) setSubscriptionOpen(true);

                                    else {
                                        setLoading(true);

                                        fetchGraphQl(createTrainerClient, { token, trainerId: trainer })
                                            .then(res => {
                                                setLoading(false);

                                                if (res.errors) return setError(true);
                                                else {
                                                    navigation.navigate("Trainers", { open: "settings", client: res.data.createTrainersClient.id })
                                                }
                                            })
                                    }
                                }
                            }
                        />
                    </ScrollView>
                ) : (
                    <View style={{ ...styles.Container, height: verticalScale(400), position: "relative", top: verticalScale(120) }}>
                        <CardForm
                            style={{ height: 200 }}
                        />

                        <Text style={{ color: "#444343", fontSize: moderateScale(15), textAlign: "center", position: "relative", top: verticalScale(-12) }} >{cardErrorStatement}</Text>

                        <Button
                            style={{ marginRight: "auto", marginLeft: "auto", backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                            textStyle={{ color: "white" }}
                            title={ConfirmSetupLoading ? 'Loading' : `Pay Now`}
                            onPress={
                                async () => {
                                    if (ConfirmSetupLoading) return

                                    else {
                                        const { setupIntent, error } = await confirmSetupIntent(subSecrets, { paymentMethodType: "Card" })

                                        if ( error ) {
                                            setCardErrorStatement( error.localizedMessage || "" )
                                        }else setGoTrainers(true);
                                    }
                                }
                            }
                        />

                        <Text style={{ color: "#444343", fontSize: moderateScale(15), textAlign: "center", position: "relative", top: verticalScale(12) }} >
                            By providing your card information, you allow Lifters International to charge your card for future payments in accordance with their terms.
                        </Text>
                    </View>
                )
            }
        </AppLayout>
    )

}

export default BecomeClient;
