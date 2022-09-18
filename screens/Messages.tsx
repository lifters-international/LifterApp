import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationProp } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { AppLayout, Loading, MessageContainer } from "../components";
import { useSelector } from "react-redux";

import { socket, SubscriptionType, returnImageSource } from "../utils";
import { useUserMatchesSubscription, useUserAcceptedMatchesSubscription } from '../hooks';

interface Props {
    navigation: NavigationProp<any>;
}

const Messages : React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const [ reload, setReload] = useState(false);
    const userMatchesSubscription = useUserMatchesSubscription(token, reload);
    const userAcceptedMatchesSubscription = useUserAcceptedMatchesSubscription(token, reload);
    const [ socketAuthenticated, setSocketAuthenticated ] = useState(false);

    useEffect(() => {
        if (!reload) {
            const unsubscribe = navigation.addListener('focus', () => {
                setReload(true);
            });
    
            return unsubscribe;
        }else {
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
                    <Text style={{ color: "red"}}>NEW MATCHES</Text>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{userMatchesSubscription.data?.matches.length}</Text>
                    </View>
                </View>
                <View style={styles.UnMatchedContain}>
                    {
                        userMatchesSubscription.data?.matches.map((match, index) => {
                            return (
                                <TouchableOpacity key={`UnMatchedLifter${index}`} style={styles.UnMatchedPeers} onPress={() => navigation.navigate("MessagesMatches", { matchId : match.id})}>
                                    <Image 
                                        source={returnImageSource(match.profilePicture)}
                                        style={styles.UnMatchedContainProfilePicture }
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }

                    {
                        userMatchesSubscription.data?.userSubscription === SubscriptionType.BASIC && userMatchesSubscription.data?.matches.length > 0 ? (
                            <BlurView tint="light" style={styles.UnMatchedPeersBlured}>
                                <View style={styles.UnMatchedPeersBluredContextLink}>
                                    <Text style={{color: "black", fontSize: 20}}>Upgrade To Pro</Text>
                                </View>
                            </BlurView>
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
        borderWidth: 1,
        borderColor: 'gainsboro',
        borderRadius: 5,
        width: "100%",
        overflowX: "scoll"
    },

    UnMatchedPeersContainerContext: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row"
    },

    circle: {
        height: 25,
        width: 25,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: "red",
        padding: 10,
        textAlign: "center",
        backgroundColor: "red",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: -4,
        left: 5
    },

    circleText: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 12,
        padding: 10,
        position: "relative",
        top: -6,
        left: -3
    },

    UnMatchedContain: {
        display: "flex",
        flexDirection: "row"
    }, 

    UnMatchedPeers: {
        marginLeft: 10
    },

    UnMatchedContainProfilePicture: {
        height: 70,
        width: 70,
        padding: 5,
        borderRadius: 30,
        borderWidth: 1,
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
        borderRadius: 50,
        padding: 10
    }
})

export default Messages;