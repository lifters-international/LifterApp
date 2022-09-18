import React, { useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";

import { AppLayout, MessageBoxContent } from "../components";
import { returnImageSource, MessageWhoSent, MessageMetaDataType } from "../utils";
import { useGetUserMessages } from "../hooks";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const MessageBox : React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const { matchId, name, profilePicture } = route.params!;
    const [messageState, setMessageState] = useState<string>("");
    const userMessages = useGetUserMessages(token, matchId);
    
    return (
        <AppLayout>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity style={styles.HeaderIconContainer} onPress={() => navigation.goBack()} >
                    <Ionicons name="arrow-back" size={30} color="black" style={styles.HeaderIcon}/>
                </TouchableOpacity>
                <View style={styles.HeaderDetailsContainer}>
                    <Image source={ returnImageSource(profilePicture, { width: 65, height: 65, borderRadius: 30 }) } resizeMode="contain" style={styles.HeaderDetailsImage}/>
                    <Text style={styles.HeaderDetailsText}>{name}</Text>
                </View>
            </View>
            
            <KeyboardAwareScrollView style={{ height: "100%"}} extraScrollHeight={90}>
                <MessageBoxContent 
                    messages={ userMessages.userMessages || []}
                    whoSent={ userMessages.whoSent as MessageWhoSent }
                    sendReadMessage={ userMessages.sendReadMessage! }
                />

                
                <View style={styles.MessageBoxInput}>
                    <TextInput style={styles.MessageBoxInputText} placeholder="Type a message" multiline value={messageState} onChangeText={ text => setMessageState(text) }/>
                    <TouchableOpacity style={styles.MessageBoxSendButton} onPress={() => {
                        if (messageState.length > 0 ) userMessages.sendMessage!(token, matchId, messageState, MessageMetaDataType.TEXT); 
                        setMessageState("");
                    }}>
                        <Ionicons name="send" size={30} color="black" style={styles.MessageBoxSendButtonIcon}/>
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
        borderBottomWidth: 1,
        borderColor: 'gainsboro',
    },

    HeaderIconContainer: {
        flex: 1
    },

    HeaderIcon: {
        marginTop: 20
    },

    HeaderDetailsContainer: {
        flex: 1.4
    },

    HeaderDetailsImage: {
        padding: 5,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "red"
    },

    HeaderDetailsText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        position: "relative",
        right: 75
    },

    MessageBoxInput: {
        borderWidth: 1,
        borderColor: 'gainsboro',
        padding: 5,
        display: "flex",
        flexDirection: "row"
    },

    MessageBoxInputText: {
        flex: 3,
        fontSize: 15,
        width: 330,
        maxHeight: 60
    },

    MessageBoxSendButton: {},

    MessageBoxSendButtonIcon: {
        color: "red",
        borderColor: "black"
    }
});

export default MessageBox;