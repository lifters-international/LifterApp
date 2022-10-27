import React from 'react';

import { AcceptedUserMatches, returnImageSource, scale, verticalScale, moderateScale } from '../utils';

import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

import { Link } from "@react-navigation/native";

export type MessageContainerProps = {
    token: string;
    matches: AcceptedUserMatches[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ token, matches }) => {
    matches.sort((a, b) => Number(b.date) - Number(a.date));

    return (
        <View style={styles.MessageContainer}>
            <View style={{ marginTop: verticalScale(20), marginBottom: verticalScale(20), padding: moderateScale(10) }}>
                <Text style={{ fontSize: moderateScale(25), color: "white" }}>Chats</Text>
            </View>

            <ScrollView style={styles.MessageHolderContext}>
                {
                    matches.length === 0 ? (
                        <View style={styles.NoMessages}>
                            <Text style={{ fontSize: 30 }}>No Messages</Text>
                        </View>
                    ) : (
                        matches.map((message: AcceptedUserMatches) => {
                            let text = message.lastMessage?.message || "";
                            const shortenedText = text.slice(0, 33) + ((text.length!) >= 33 ? "..." : "");

                            return (
                                <Link
                                    key={message.id}
                                    style={styles.MessageMatches}
                                    to={{ screen: "MessageBox", params: { matchId: message.id, name: message.name, profilePicture: message.profilePicture } }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Image
                                            source={
                                                returnImageSource(message.profilePicture, { width: scale(40), height: verticalScale(40), borderRadius: moderateScale(30) })
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
        marginTop: moderateScale(4)
    },

    MessageHolderContext: {
        height: "78%",
        borderRadius: moderateScale(5)
    },

    MessageMatchesProfilePicture: {
        width: scale(60),
        height: verticalScale(60),
        padding: moderateScale(5)
    },

    MessageMatches: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: "gainsboro",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        display: "flex",
        flexDirection: "row",
        gap: moderateScale(10),
        marginTop: moderateScale(10)
    },

    MessageMatchesContext: {
        flex: moderateScale(3),

    },

    MessageMatchesContextNameHeader: {
        display: "flex",
        flexDirection: "row",
        marginTop: moderateScale(4)
    },

    MessageMatchesContextName: {
        fontWeight: "bold",
        fontSize: moderateScale(20),
        color: "white"
    },

    circle: {
        height: verticalScale(25),
        width: scale(25),
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
        fontSize: moderateScale(12),
        padding: moderateScale(10),
        position: "relative",
        top: verticalScale(-6),
        left: scale(-3)
    },

    MessageMatchesContextMessage: {
        fontSize: moderateScale(17),
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