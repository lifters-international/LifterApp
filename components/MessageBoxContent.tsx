import React, { useRef } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import { Message, MessageWhoSent, verticalScale, moderateScale } from "../utils";

import MessageView from "./Message";

export type MessageBoxContentProps = {
    messages: Message[];
    whoSent: MessageWhoSent;
    sendReadMessage: ( messageId : string ) => void;
}

const MessageBoxContent : React.FC<MessageBoxContentProps> = ({ messages, whoSent, sendReadMessage }) => {
    const contentRef = useRef<ScrollView>(null);

    if ( messages.length === 0 ) {
        return (
            <View style={styles.MessageBoxContent}>
                <Text style={styles.NoMessages}>Start by saying hi 👋</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ ...styles.MessageBoxContent, ...styles.Content }} ref={contentRef} horizontal={false} onContentSizeChange={() => contentRef.current?.scrollToEnd({ animated: true })}>
            {
                messages.slice().sort((a, b) =>  a.createdAt - b.createdAt ).map((message, index) => {
                    if ( index == 0) return (
                        <MessageView 
                            key={`MessageViewDiv-${index}`}
                            {...message}
                            lastMessage={index === messages.length - 1}
                            CurrentWhoSent={whoSent}
                            sendReadMessage={sendReadMessage}
                        />
                    )

                    else if ( messages[index].whoSent === messages[index - 1].whoSent ) return (
                        <MessageView 
                            key={`MessageViewDiv-${index}`}
                            {...message}
                            lastMessage={index === messages.length - 1}
                            CurrentWhoSent={whoSent}
                            sendReadMessage={sendReadMessage}
                        />
                    )

                    else return ( 
                        <View style={styles.divideTheySentYouSent} key={`divideTheySentYou-${index}`}>
                            <MessageView 
                                key={`MessageViewDiv-${index}`}
                                {...message}
                                lastMessage={index === messages.length - 1}
                                CurrentWhoSent={whoSent}
                                sendReadMessage={sendReadMessage}
                            />
                        </View>
                    )
                })
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    MessageBoxContent: {
        height: verticalScale(440),
        backgroundColor: "#1d1c1c"
    },

    NoMessages: {
        textAlign: 'center',
        fontSize: moderateScale(30),
        position: 'relative',
        top: verticalScale(200),
        color: "white"
    },

    Content: {
        height: verticalScale(530)
    },

    divideTheySentYouSent: {
        marginTop: moderateScale(12)
    }
});

export default MessageBoxContent;