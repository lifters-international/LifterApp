import React, { useState, useEffect } from "react";

import { StyleSheet, Text, View, Image, ScrollView, TextInput, ImageBackground, FlatList, Platform, Linking, Alert } from 'react-native';

import { Entypo, Feather } from '@expo/vector-icons';

import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher'
import { AppLayout, Button, Loading } from "../components";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { scale, verticalScale, moderateScale, returnImageSource, shortenText, shortenNumber } from "../utils";
import { useLoggedInUserHomePage } from "../hooks";

interface Props {
    navigation: NavigationProp<any>;
}

const Profile: React.FC<Props> = ({ navigation }) => {
    const { token, profilePicture } = useSelector( ( state: any ) => state.Auth );

    const { loading, errors, data } = useLoggedInUserHomePage(token);

    console.log({ loading, errors, data });

    if ( loading ) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if ( errors.length > 0 ) {
        return (
            <AppLayout backgroundColor="black">
                <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(250), height: verticalScale(60), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>{errors[0].message}</Text>
                </View>
            </AppLayout>
        )
    }

    return (
        <AppLayout backgroundColor="black">
            <ScrollView>
                <View style={{ marginTop: verticalScale(20), borderBottomWidth: moderateScale(0.5), borderBottomColor: "#3c3b3b" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Feather name="plus-square" size={moderateScale(30)} color="#FF3636" style={{ marginLeft: moderateScale(20) }} onPress={ () => navigation.navigate("CreateReels") } />
                        <Entypo name="dots-three-vertical" size={moderateScale(30)} color="#FF3636"  />
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(15), padding: moderateScale(20) }}>
                        <Image source={ returnImageSource(data?.profilePicture || "/defaultPicture.png") } style={{ width: scale(120), height: verticalScale(120), borderRadius: moderateScale(100) }} resizeMode="stretch" />
                        
                        <View style={{ marginLeft: moderateScale(20) }}>
                            <Text style={{ color: "#959595", fontSize: moderateScale(22), marginBottom: moderateScale(10) }}>{data?.username}</Text>
                            <Text style={{ color: "#3c3b3b", fontSize: moderateScale(15) }}>{shortenText(data!.bio, 40)}</Text>
                        </View>
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: scale(320), marginRight: 'auto', marginLeft: 'auto', padding: moderateScale(15), borderColor: "#3c3b3b", borderTopWidth: moderateScale(0.5), borderBottomWidth: moderateScale(0.5) }}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ color: "#959595", fontSize: moderateScale(22), marginBottom: moderateScale(10), textAlign: 'center' }}>{shortenNumber(data!.reels.length)}</Text>
                            <Text style={{ color: "#3c3b3b", fontSize: moderateScale(20), textAlign: 'center' }}>Reels</Text>
                        </View>

                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ color: "#959595", fontSize: moderateScale(22), marginBottom: moderateScale(10), textAlign: 'center' }}>{shortenNumber(data!.followers)}</Text>
                            <Text style={{ color: "#3c3b3b", fontSize: moderateScale(20), textAlign: 'center' }}>Followers</Text>
                        </View>

                        <View style={{ justifyContent: "center" }}>
                            <Text style={{ color: "#959595", fontSize: moderateScale(22), marginBottom: moderateScale(10), textAlign: 'center' }}>{shortenNumber(data!.following)}</Text>
                            <Text style={{ color: "#3c3b3b", fontSize: moderateScale(20), textAlign: 'center' }}>Following</Text>
                        </View>
                    </View>

                    <Button
                        title="Edit Profile"
                        textStyle={{ color: "white", fontSize: moderateScale(25) }}
                        style={{ alignItems: "center", backgroundColor: "red", width: scale(320), padding: 10, height: verticalScale(50), marginRight: 'auto', marginLeft: 'auto', marginTop: moderateScale(20), marginBottom: moderateScale(20), borderRadius: moderateScale(10) }}
                        onPress={() => navigation.navigate("ProfileSettings")}
                    />
                </View>
            </ScrollView>
        </AppLayout>
    )
}

export default Profile;

