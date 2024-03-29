import React, { useCallback, useEffect, useState } from "react";

import { Text, View, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

import { Entypo, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

import { AppLayout, Button, Loading } from "../components";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { scale, verticalScale, moderateScale, returnImageSource, shortenText, shortenNumber, turnArrayIntoDimensionalArray } from "../utils";
import { useLoggedInUserHomePage } from "../hooks";
import { ResizeMode, Video } from "expo-av";

interface Props {
    navigation: NavigationProp<any>;
}

const Profile: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);

    const [refreshing, setRefreshing] = useState(false);

    const { loading, errors, data } = useLoggedInUserHomePage(token, refreshing);

    const [view, setView] = useState<"saved" | "reels">("reels");

    const onRefresh = useCallback(() => {
        setRefreshing(true);
    }, []);

    useEffect(() => {
        setRefreshing(true);
    }, [view]);

    useEffect(() => {
        setRefreshing(loading);
    }, [data]);

    if (loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if (errors.length > 0) {
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
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ marginTop: verticalScale(20) }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Feather name="plus-square" size={moderateScale(30)} color="#FF3636" style={{ marginLeft: moderateScale(20) }} onPress={() => navigation.navigate("CreateReels")} />
                        <Entypo name="dots-three-vertical" size={moderateScale(30)} color="#FF3636" />
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(15), padding: moderateScale(20) }}>
                        <Image source={returnImageSource(data?.profilePicture || "/defaultPicture.png")} style={{ width: scale(120), height: verticalScale(120), borderRadius: moderateScale(100) }} resizeMode="stretch" />

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

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: moderateScale(15), borderBottomWidth: moderateScale(1), borderBottomColor: "#FF3636" }}>
                    <View
                        style={{
                            position: "relative",
                            left: scale(60),
                            marginBottom: moderateScale(10),
                            ...(view === "reels" ? { borderBottomColor: "#FF3636", borderBottomWidth: moderateScale(1) } : {})
                        }}
                    >
                        <MaterialIcons name="widgets" size={moderateScale(40)} color="#FF3636" style={view === "reels" ? { marginBottom: moderateScale(10) } : undefined} onPress={() => setView("reels")} />
                    </View>

                    <View
                        style={{
                            position: "relative",
                            right: scale(50),
                            marginBottom: moderateScale(10),
                            ...(view === "saved" ? { borderBottomColor: "#FF3636", borderBottomWidth: moderateScale(1) } : {})
                        }}
                    >
                        <Ionicons name="bookmark" size={moderateScale(40)} color="#FF3636" style={view === "saved" ? { marginBottom: moderateScale(10) } : undefined} onPress={() => setView("saved")} />
                    </View>
                </View>

                <View style={{ marginBottom: moderateScale(100), marginTop: moderateScale(15) }}>
                    {
                        (turnArrayIntoDimensionalArray(view == "reels" ? data!.reels : data!.reelsSaves) as { id: string, video_url: string }[][]).map((row, index) => (
                            <View key={`profile-reel-row${index}`} style={{ display: "flex", flexDirection: "row" }}>
                                {
                                    row.map((reel, index) => (
                                        <TouchableOpacity key={`profile-reel-row-reel-${index}`}
                                            onPress={
                                                () => {
                                                    navigation.navigate("WatchLifterProfileReels", { scrollToReel: reel.id, viewToShow: "reels" })
                                                }
                                            }
                                        >
                                            <Video
                                                source={returnImageSource(reel.video_url)}
                                                style={{ width: scale(120), height: verticalScale(180), borderRadius: moderateScale(10) }}
                                                resizeMode={ResizeMode.STRETCH}
                                                useNativeControls={false}
                                            />
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        </AppLayout>
    )
}

export default Profile;

