import React from "react";

import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';

import { Entypo, Feather } from '@expo/vector-icons';

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
    const { token } = useSelector( ( state: any ) => state.Auth );

    const { loading, errors, data } = useLoggedInUserHomePage(token);

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

                <View style={{ marginBottom: moderateScale(100), marginTop: moderateScale(15) }}>
                    {
                        ( turnArrayIntoDimensionalArray(data!.reels) as { id: string, video_url: string }[][]).map( ( row, index ) => (
                            <View key={`profile-reel-row${index}`} style={{ display: "flex", flexDirection: "row" }}>
                                {
                                    row.map( ( reel, index ) => (
                                        <TouchableOpacity key={`profile-reel-row-reel-${index}`}
                                            onPress={
                                                () => {
                                                    navigation.navigate("WatchLifterProfileReels", { scrollToReel: reel.id })
                                                }
                                            }
                                        >
                                            <Video
                                                source={ returnImageSource(reel.video_url) }
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

