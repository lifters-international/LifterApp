import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationProp } from "@react-navigation/native";
import { AppLayout, Loading, MessageContainer } from "../components";
import { useSelector } from "react-redux";

import { socket, SubscriptionType, returnImageSource, scale, verticalScale, moderateScale } from "../utils";
import { useUserMatchesSubscription, useUserAcceptedMatchesSubscription } from '../hooks';

interface Props {
    navigation: NavigationProp<any>;
}

const Messages: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const [reload, setReload] = useState(false);
    const userMatchesSubscription = useUserMatchesSubscription(token, reload);
    const userAcceptedMatchesSubscription = useUserAcceptedMatchesSubscription(token, reload);
    const [socketAuthenticated, setSocketAuthenticated] = useState(false);

    useEffect(() => {
        if (!reload) {
            const unsubscribe = navigation.addListener('focus', () => {
                setReload(true);
            });

            return unsubscribe;
        } else {
            setReload(false);
        }
    }, [navigation, reload]);


    socket.on("authenticated", () => {
        setSocketAuthenticated(true);
    })

    if (!socketAuthenticated) {
        socket.authenticate(token);
    }

    if (userMatchesSubscription.loading || userAcceptedMatchesSubscription.loading || !socketAuthenticated) {
        return <AppLayout><Loading /></AppLayout>
    }

    return (
        <AppLayout>
            <View style={styles.UnMatchedLiftersContainer}>
                <View style={styles.UnMatchedPeersContainerContext}>
                    <Text style={{ color: "red", fontSize: moderateScale(15) }}>NEW MATCHES</Text>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{userMatchesSubscription.data?.matches.length}</Text>
                    </View>
                </View>
                <View style={styles.UnMatchedContain}>
                    {
                        userMatchesSubscription.data?.matches.map((match, index) => {
                            return (
                                <TouchableOpacity key={`UnMatchedLifter${index}`} style={styles.UnMatchedPeers} onPress={() => navigation.navigate("MessagesMatches", { matchId: match.id })}>
                                    <Image
                                        source={returnImageSource(match.profilePicture)}
                                        style={styles.UnMatchedContainProfilePicture}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }

                    {
                        userMatchesSubscription.data?.userSubscription === SubscriptionType.BASIC && userMatchesSubscription.data?.matches.length > 0 ? (
                            <View style={styles.UnMatchedPeersBlured}>
                                <View style={styles.UnMatchedPeersBluredContextLink}>
                                    <Text style={{ color: "black", fontSize: moderateScale(20) }}>Upgrade To Pro</Text>
                                </View>
                            </View>
                        ) : null
                    }
                </View>
            </View>
            <MessageContainer
                token={token}
                matches={userAcceptedMatchesSubscription.data}
            />
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    UnMatchedLiftersContainer: {
        borderWidth: moderateScale(1),
        borderColor: 'gainsboro',
        borderRadius: moderateScale(5),
        width: "100%",
        overflowX: "scoll"
    },

    UnMatchedPeersContainerContext: {
        marginTop: moderateScale(10),
        display: "flex",
        flexDirection: "row"
    },

    circle: {
        height: verticalScale(30),
        width: scale(35),
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(50),
        borderColor: "red",
        padding: moderateScale(10),
        textAlign: "center",
        backgroundColor: "red",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: verticalScale(-4),
        left: scale(5)
    },

    circleText: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: moderateScale(25),
        padding: moderateScale(10),
        position: "relative",
        top: verticalScale(-6),
        left: 0,
        width: scale(40),
        height: verticalScale(35),
        zIndex: 1000
    },

    UnMatchedContain: {
        display: "flex",
        flexDirection: "row"
    },

    UnMatchedPeers: {
        marginLeft: moderateScale(10)
    },

    UnMatchedContainProfilePicture: {
        height: verticalScale(70),
        width: scale(70),
        padding: moderateScale(5),
        borderRadius: moderateScale(30),
        borderWidth: moderateScale(1),
        borderColor: "red",
    },

    UnMatchedPeersBlured: {
        position: "absolute",
        top: "1%",
        backgroundColor: "rgba(255, 104, 104, 0.26)",
        width: "100%",
        height: "100%",
    },

    UnMatchedPeersBluredContextLink: {
        position: "absolute",
        top: "25%",
        left: "31%",
        backgroundColor: "white",
        borderRadius: moderateScale(50),
        padding: moderateScale(10)
    }
})

export default Messages;
