import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, ScrollView, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Ionicons, Zocial } from '@expo/vector-icons';

import { Loading, AppLayout, VideoSummary } from "../components";

import { useNotifications, useSearchVideo } from "../hooks";
import { scale, moderateScale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
}

const Reels: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector(( state : any ) => state.Auth);

    return (
        <AppLayout backgroundColor="black">
            <View>

            </View>
        </AppLayout>
    )
}

export default Reels;
