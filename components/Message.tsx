import React, { useEffect } from 'react';

import { View, Text, Image, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

import { Message, MessageWhoSent, MessageMetaDataType, returnImageSource, UserMessageStatus, scale, moderateScale } from '../utils';

export type MessageProps = {
    CurrentWhoSent: MessageWhoSent;
    lastMessage: boolean;
    sendReadMessage: ( messageId : string ) => void;
} & Message;

const Messages: React.FC<MessageProps> = ({ id, status, metaDataType, message, whoSent, CurrentWhoSent, sendReadMessage }) => {
    useEffect(() => {
        if ( whoSent !== CurrentWhoSent && status === UserMessageStatus.DELIVERED ) {
            sendReadMessage(id);
        }
    }, [ ])
    
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
        maxWidth: scale(200),
        boxShadow: "0 0 5px #ccc",
        alignSelf: 'flex-end',
        borderWidth: moderateScale(1),
        borderColor: "black",
        backgroundColor: "black",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
    },

    MessageViewThey: {
        backgroundColor: "hsl(0, 1%, 18%)",
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        boxShadow: "0 0 5px #ccc",
        alignSelf: 'flex-start',
        maxWidth: scale(200)
    },

    YouSentMessage: {
        color: "white",
        fontSize: moderateScale(16),
    },

    TheySentMessage: {
        color: "white", 
        fontSize: moderateScale(16),
    },

    MessageImage: {},

    MessageVideo: {},
});

export default Messages;