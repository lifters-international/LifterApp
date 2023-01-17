import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppLayout, Loading, MessageContainer } from "../components";
import { useSelector } from "react-redux";

import { socket, SubscriptionType, returnImageSource, scale, verticalScale, moderateScale } from "../utils"
import { useUserMatchesSubscription, useUserAcceptedMatchesSubscription } from '../hooks';

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const Messages: React.FC<Props> = ({ route, navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const [reload, setReload] = useState(false);
    const userMatchesSubscription = useUserMatchesSubscription(token, reload);
    const userAcceptedMatchesSubscription = useUserAcceptedMatchesSubscription(token, reload);
    const [socketAuthenticated, setSocketAuthenticated] = useState(false);
    const { setTabBarVisiblity } = useTabBarContext();


    useEffect(() => {
        if ( route.params === undefined ) return;

        let { command, matchId, name, profilePicture } = route.params;

        if ( command === "newMessageSent" ) {
            setTabBarVisiblity(false);
            navigation.navigate("MessageBox", { matchId, name, profilePicture } );
        }
        
    }, [ route ])
    
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


    socket.onMessages("authenticated", () => {
        setSocketAuthenticated(true);
    })

    if (!socketAuthenticated) {
        socket.messagesAuthenticate(token);
    }
    
    if (userMatchesSubscription.loading || userAcceptedMatchesSubscription.loading || !socketAuthenticated ) {
        return <AppLayout backgroundColor="black"><Loading /></AppLayout>
    }

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Header}>
                <Text style={styles.HeaderText}>MESSAGES</Text>
                <Image
                    source={require("../assets/images/hero-section-line-vector.png")}
                    style={styles.line}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.UnMatchedLiftersContainer}>
                <View style={styles.UnMatchedPeersContainerContext}>
                    <Text style={{ color: "white", fontSize: moderateScale(20) }}>New Matches</Text>
                    <Text style={styles.circleText}>{userMatchesSubscription.data?.matches.length}</Text>
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
                </View>
            </View>
            <MessageContainer
                matches={userAcceptedMatchesSubscription.data}
                navigation={navigation}
            />
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Header: {
        padding: moderateScale(10),
        height: verticalScale(110)
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        position: "relative",
        top: moderateScale(20)
    },

    line: {
        height: verticalScale(100),
        width: scale(400),
        zIndex: 1,
        position: "relative",
        bottom: moderateScale(25)
    },

    UnMatchedLiftersContainer: {
        borderWidth: moderateScale(1),
        borderTopColor: 'hsl(0, 1%, 22%)',
        borderRadius: moderateScale(5),
        width: "100%",
        overflowX: "scoll"
    },

    UnMatchedPeersContainerContext: {
        marginTop: moderateScale(10),
        display: "flex",
        flexDirection: "row"
    },

    circleText: {
        color: "#FF3636",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: moderateScale(25),
        padding: moderateScale(10),
        position: "relative",
        bottom: verticalScale(12),
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
        padding: moderateScale(5)
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
