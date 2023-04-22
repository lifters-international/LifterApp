import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, ScrollView, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Ionicons, Zocial } from '@expo/vector-icons';

import { Loading, AppLayout, VideoSummary } from "../components";

import { useReels } from "../hooks";
import { scale, moderateScale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
}

const Reels: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector(( state : any ) => state.Auth);
    const [refreshing, setRefreshing] = useState(false);

    const { 
        loading, reels, subscribeToEvent, unSubscribeToEvent, postComment, shareReel, getParentComments, 
        getReelsInformation, likeReel, saveReel, updateCaption, deleteReel, downloadReel, askForChildren, 
        createViewHistory, updateViewHistory
    } = useReels(token, refreshing);

    console.log( reels );

    return (
        <AppLayout backgroundColor="black">
            <View>

            </View>
        </AppLayout>
    )
}

export default Reels;
