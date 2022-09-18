import React from 'react';

import { AcceptedUserMatches, Message, MessageWhoSent, MessageMetaDataType, returnImageSource } from '../utils';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

import { Link } from "@react-navigation/native";

export type MessageContainerProps = {
    token: string;
    matches: AcceptedUserMatches[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ token, matches }) => {
    matches.sort( (a, b) => Number(b.date) - Number(a.date));

    return (
        <View style={styles.MessageContainer}>
            <ScrollView style={styles.MessageHolderContext}>
                {
                    matches.length === 0 ? (
                        <View style={styles.NoMessages}>
                            <Text style={{ fontSize: 30 }}>No Messages</Text>
                        </View>
                    ) : (
                        matches.map(( message : AcceptedUserMatches ) => {
                            let text = message.lastMessage?.message || "";
                            const shortenedText = text.slice(0, 33) + ((text.length!) >= 33 ? "..." : "");

                            return (
                                <Link 
                                    key={message.id} 
                                    //onPress={() => setCurrentView({ currentMatchId: message.id, name: message.name, profilePicture: message.profilePicture })}
                                    style={styles.MessageMatches}
                                    to={{ screen: "MessageBox", params: { matchId: message.id, name: message.name, profilePicture: message.profilePicture } }}
                                    >
                                    <View style={{ flex: 1}}>
                                        <Image 
                                            source={ 
                                                returnImageSource(message.profilePicture, { width: 40, height: 40, borderRadius: 30 })
                                            } 
                                            style={styles.MessageMatchesProfilePicture}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View style={styles.MessageMatchesContext}>
                                        <View style={styles.MessageMatchesContextNameHeader}>
                                            <Text style={styles.MessageMatchesContextName}>{message.name}</Text>
                                            {
                                                message.unreadMessages > 0 ? (
                                                    <View style={styles.circle}>
                                                        <Text style={styles.circleText}>{message.unreadMessages}</Text>
                                                    </View>
                                                ) : null
                                            }
                                        </View>
                                        <Text style={styles.MessageMatchesContextMessage}>{shortenedText}</Text>
                                    </View>
                                </Link>
                            )
                        })
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    MessageContainer: {
        marginTop: 4
    },

    MessageHolderContext: {
        height: "78%",
        borderTopWidth: 1,
        borderTopColor: "gainsboro",
        borderRadius: 5
    }, 

    MessageMatchesProfilePicture: {
        width: 60,
        height: 60,
        padding: 5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "red"
    },

    MessageMatches: {
        borderBottomWidth: 1,
        borderBottomColor: "gainsboro",
        borderRadius: 5,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        marginTop: 10
    },

    MessageMatchesContext: {
        flex: 3
    },

    MessageMatchesContextNameHeader: {
        display: "flex",
        flexDirection: "row",
        marginTop: 4
    },

    MessageMatchesContextName: {
        fontWeight: "bold",
        fontSize: 20,
        color: "black"
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

    MessageMatchesContextMessage: {
        fontSize: 17,
        color: "rgb(139, 139, 139)"
    },

    NoMessages: {
        fontWeight: "bold",
        marginRight: "auto",
        marginLeft: "auto",
        position: "relative",
        top: "50%"
    }
});

export default MessageContainer;