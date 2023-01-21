import React, { useState, useRef } from "react";

import { NavigationProp, RouteProp } from "@react-navigation/native";
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';


import { returnImageSource, TrainersClientMessage, scale, verticalScale, moderateScale } from "../utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MessageView from "./TrainersClientMessageView";
import Loading from "./Loading";

export type MessageProps = {
    token: string;
    name: string;
    profilePicture: string;
    client: string;
    trainer: string;
    messages: TrainersClientMessage[];
    sendMessage?: (token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO") => void;
    sendReadMessage?: (messageId: string) => void;
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

export const TrainsClientMessage: React.FC<MessageProps> = ({ token, profilePicture, name, client, navigation, messages, trainer, sendMessage, sendReadMessage }) => {
    const contentRef = useRef<ScrollView>(null);
    const [messageState, setMessageState] = useState<string>("");
    
    if ( profilePicture.length === 0 ) return <Loading />

    return (
        <View>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("TrainerPage", { trainer })} style={{ display: "flex", flexDirection: "row" }}>
                    <Image source={returnImageSource(profilePicture)} resizeMode="stretch" style={styles.HeaderDetailsImage} />
                    <Text style={{ ...styles.HeaderDetailsText, fontSize: scale(20 + (name.length / 10)) }}>{`${name.slice(0, 15)}${name.length > 15 ? "..." : ""}`}</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity
                        onPress={
                            () => navigation.setParams({ client, open: "settings" })
                        }
                    >
                        <Ionicons name="md-settings" color="#FF3636" size={moderateScale(40)} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAwareScrollView style={{ height: "100%" }} extraScrollHeight={verticalScale(220)}>
                {
                    messages.length === 0 ? (
                        <View style={styles.MessageBoxContent}>
                            <Text style={styles.NoMessages}>Start by saying hi 👋</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ ...styles.MessageBoxContent, ...styles.Content }} ref={contentRef} horizontal={false} onContentSizeChange={() => contentRef.current?.scrollToEnd({ animated: true })} >
                            {
                                messages.slice().sort((a, b) => a.createdAt - b.createdAt).map((message, index) => {
                                    if (index == 0) return (
                                        <MessageView
                                            key={`MessageViewDiv-${index}`}
                                            {...message}
                                            lastMessage={index === messages.length - 1}
                                            sendReadMessage={sendReadMessage}
                                        />
                                    )

                                    else if (messages[index].whoSent === messages[index - 1].whoSent) return (
                                        <MessageView
                                            key={`MessageViewDiv-${index}`}
                                            {...message}
                                            lastMessage={index === messages.length - 1}
                                            sendReadMessage={sendReadMessage}
                                        />
                                    )

                                    else return (
                                        <View style={styles.divideTheySentYouSent} key={`divideTheySentYou-${index}`}>
                                            <MessageView
                                                key={`MessageViewDiv-${index}`}
                                                {...message}
                                                lastMessage={index === messages.length - 1}
                                                sendReadMessage={sendReadMessage}
                                            />
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    )
                }

                <View style={styles.MessageBoxInput}>
                    <TextInput
                        style={styles.MessageBoxInputText}
                        placeholder="Type a message"
                        placeholderTextColor="white"
                        multiline value={messageState}
                        onChangeText={text => setMessageState(text)}
                    />
                    <TouchableOpacity style={styles.MessageBoxSendButton} onPress={() => {
                        if (messageState.length > 0) sendMessage!( token, messageState, "TEXT" )
                        setMessageState("");
                    }}>
                        <Ionicons name="send" size={moderateScale(30)} color="black" style={styles.MessageBoxSendButtonIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    HeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: verticalScale(70),
        justifyContent: "space-between"
    },

    HeaderDetailsContainer: {
        flex: moderateScale(7),
        width: "100%",
        display: 'flex',
        flexDirection: 'row'
    },

    HeaderDetailsImage: {
        padding: moderateScale(5),
        width: scale(65),
        height: verticalScale(65),
        borderRadius: moderateScale(30)
    },

    HeaderDetailsText: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
        position: "relative",
        top: verticalScale(15)
    },

    MessageBoxInput: {
        padding: moderateScale(5),
        display: "flex",
        flexDirection: "row"
    },

    MessageBoxInputText: {
        flex: moderateScale(3),
        fontSize: moderateScale(18),
        width: scale(330),
        maxHeight: verticalScale(60),
        color: "white"
    },

    MessageBoxSendButton: {},

    MessageBoxSendButtonIcon: {
        color: "white",
        borderColor: "black"
    },

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
