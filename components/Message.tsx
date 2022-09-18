import React from 'react';

import { View, Text, Image, StyleSheet } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';

import { Message, MessageWhoSent, MessageMetaDataType, returnImageSource } from '../utils';

export type MessageProps = {
    CurrentWhoSent: MessageWhoSent;
    lastMessage: boolean;
} & Message;

const Messages: React.FC<MessageProps> = ({ id, status, metaDataType, message, createdAt, whoSent, CurrentWhoSent, lastMessage, timeRead }) => {
    return (
        <View style={styles.MessageContainer} data-id={id}>
            <View style={whoSent === CurrentWhoSent ? styles.MessageViewYou : styles.MessageViewThey}>
                {
                    metaDataType === MessageMetaDataType.IMAGE ?
                        <Image source={returnImageSource(message)} style={styles.MessageImage} />
                        : metaDataType === MessageMetaDataType.VIDEO ?
                            (
                                <Video
                                    source={{ uri: message }}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    style={styles.MessageVideo}
                                />
                            )
                            : (
                                <Text style={whoSent === CurrentWhoSent ? styles.YouSentMessage : styles.TheySentMessage}>{message}</Text>
                            )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    MessageContainer: {
        width: "100%",
    },

    MessageViewYou: {
        maxWidth: 200,
        boxShadow: "0 0 5px #ccc",
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderColor: "rgb(29, 134, 253)",
        backgroundColor: "rgb(29, 134, 253)",
        borderRadius: 10,
        padding: 10,
    },

    MessageViewThey: {
        backgroundColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        boxShadow: "0 0 5px #ccc",
        alignSelf: 'flex-start',
        maxWidth: 200
    },

    YouSentMessage: {
        color: "white",
    },

    TheySentMessage: {
        color: "white"
    },

    MessageImage: {},

    MessageVideo: {},
});

export default Messages;