import React, { useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";

import { AppLayout, MessageBoxContent, Loading } from "../components";
import { returnImageSource, MessageWhoSent, MessageMetaDataType, scale, verticalScale, moderateScale } from "../utils";
import { useGetUserMessages } from "../hooks";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const MessageBox: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { matchId, name, profilePicture } = route.params!;
    const [messageState, setMessageState] = useState<string>("");
    const userMessages = useGetUserMessages(token, matchId);

    if (userMessages.loading) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity style={styles.HeaderIconContainer} onPress={() => navigation.goBack()} >
                    <Ionicons name="arrow-back" size={moderateScale(30)} color="black" style={styles.HeaderIcon} />
                </TouchableOpacity>
                <View style={styles.HeaderDetailsContainer}>
                    <Image source={returnImageSource(profilePicture, { width: scale(65), height: verticalScale(65), borderRadius: moderateScale(30) })} resizeMode="contain" style={styles.HeaderDetailsImage} />
                    <Text style={styles.HeaderDetailsText}>{name}</Text>
                </View>
            </View>


            <KeyboardAwareScrollView style={{ height: "100%" }} extraScrollHeight={verticalScale(90)}>
                <MessageBoxContent
                    messages={userMessages.userMessages || []}
                    whoSent={userMessages.whoSent as MessageWhoSent}
                    sendReadMessage={userMessages.sendReadMessage!}
                />

                <View style={styles.MessageBoxInput}>
                    <TextInput style={styles.MessageBoxInputText} placeholder="Type a message" multiline value={messageState} onChangeText={text => setMessageState(text)} />
                    <TouchableOpacity style={styles.MessageBoxSendButton} onPress={() => {
                        if (messageState.length > 0) userMessages.sendMessage!(token, matchId, messageState, MessageMetaDataType.TEXT);
                        setMessageState("");
                    }}>
                        <Ionicons name="send" size={moderateScale(30)} color="black" style={styles.MessageBoxSendButtonIcon} />
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

        </AppLayout>
    )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: moderateScale(1),
        borderColor: 'gainsboro',
    },

    HeaderIconContainer: {
        flex: moderateScale(1)
    },

    HeaderIcon: {
        marginTop: moderateScale(20)
    },

    HeaderDetailsContainer: {
        flex: moderateScale(1.4)
    },

    HeaderDetailsImage: {
        padding: moderateScale(5),
        borderRadius: moderateScale(30),
        borderWidth: moderateScale(1),
        borderColor: "red"
    },

    HeaderDetailsText: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        position: "relative",
        right: moderateScale(75)
    },

    MessageBoxInput: {
        borderWidth: moderateScale(1),
        borderColor: 'gainsboro',
        padding: moderateScale(5),
        display: "flex",
        flexDirection: "row"
    },

    MessageBoxInputText: {
        flex: moderateScale(3),
        fontSize: moderateScale(15),
        width: scale(330),
        maxHeight: verticalScale(60)
    },

    MessageBoxSendButton: {},

    MessageBoxSendButtonIcon: {
        color: "red",
        borderColor: "black"
    }
});

export default MessageBox;