import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Audio } from "expo-av";

import { useWatchProfiledUserReels } from "../hooks";
import { AppLayout, Loading, UserProfileReels } from "../components";

import { moderateScale, scale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

export const WatchProfiledUserReels: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);

    const [refreshing, setRefreshing] = useState(false);

    const [profiledUserId, setProfiledUser] = useState("");

    const { 
        loading, errors, data, subscribeToEvent, unSubscribeToEvent, postComment, shareReel, getParentComments, 
        getReelsInformation, likeReel, saveReel, updateCaption, deleteReel, downloadReel, askForChildren, 
        createViewHistory, updateViewHistory
    } = useWatchProfiledUserReels(token, profiledUserId, refreshing);

    const scrollViewRef = useRef<ScrollView>(null);

    const [ scrollPos, setScrollPos ] = useState<{ x: number, y: number, animate: boolean }>({ x: 0, y: 0, animate: true });

    const [ scrollEnabled, setScrollEnabled ] = useState(true);

    const { setTabBarVisiblity, navigate } = useTabBarContext();

    const [ typeScreen, setTypeScreen ] = useState<"settings" | null>();

    const [ isVideoMuted, setMuteVideo ] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing( true );
    }, []);

    useEffect( () => {
        setTabBarVisiblity(false);

        return () => {
            return setTabBarVisiblity(true);
        }
    }, []);

    const moveToY = ( val : number, animate = true ) => {
        let max = ( ( ( data?.reels.length || 1 ) - 1 )  * verticalScale(660) );

        setScrollPos( prev => ({
            ...prev,
            y: val <= max && val >= 0 ? val :
                val > max ? max : 0,
            animate
        }));

        if ( !animate ) {
            setScrollPos( prev => ({ ...prev, animate: true }));
        }
    }

    useEffect( () => {
        const setUp = async () => {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

            if (route.params?.profiledUserId) {
                setProfiledUser(route.params.profiledUserId);
            }

            if (route.params?.typeScreen) {
                setTypeScreen("settings");
            }

            if ( route.params?.scrollToReel && scrollViewRef && loading === false ) {
                let { scrollToReel } = route.params;

                let yIndex = data ? data.reels.findIndex( r => r.id === scrollToReel ) : 0;

                if ( yIndex != 0 ) moveToY(yIndex * verticalScale(660), false );
            }
        }

        setUp();

    }, [ scrollViewRef, navigation, loading ])

    useEffect(() => {
        scrollViewRef.current?.scrollTo({ ...scrollPos });
    }, [ scrollPos ]);

    useEffect(() => {
        setRefreshing(loading);
    }, [ data ]);

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
                ref={scrollViewRef}
                scrollEnabled={scrollEnabled}
                onScrollEndDrag={
                    ( event ) => {
                        if ( event.nativeEvent.velocity!.y < 0 ) {
                            moveToY(scrollPos.y - verticalScale(660));
                        }else if ( event.nativeEvent.velocity!.y > 0 ) {
                            moveToY(scrollPos.y + verticalScale(660));
                        }
                    }
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {
                    data?.reels.map((reel, index) => (
                        <UserProfileReels 
                            key={`lifter-reels-${index}`}

                            componentData={{
                                userId: data!.id,
                                usersProfilePicture: data?.profilePicture,
                                shouldPlay: scrollPos.y / verticalScale(660) === index,
                                isVideoMuted,
                                allowEdit: true,
                                allowDelete: true,
                                track: true,
                                allowProfileView: true
                            }}

                            functions={{
                                getReelsInformation,
                                likeReel,
                                saveReel,
                                updateCaption,
                                getParentComments,
                                deleteReel,
                                downloadReel,
                                askForChildren,
                                subscribeToEvent, 
                                unSubscribeToEvent,
                                enableScroll: () => setScrollEnabled(true),
                                disableScroll: () => setScrollEnabled(false),
                                toggleMuteVideo: ( mute?: boolean ) => setMuteVideo(mute || !isVideoMuted),
                                postComment,
                                shareReel,
                                createViewHistory,
                                updateViewHistory,
                                goToUserProfile: ( userIdParam: string ) => data!.id != userIdParam ? navigation.navigate("UserProfilePage", { userId: profiledUserId, typeScreen }) : typeScreen ? navigation.navigate("Profile") : navigate("Profile", {})
                            }}

                            reel={reel}
                        />
                    ))
                }
            </ScrollView>
        </AppLayout>
    );
}

export default WatchProfiledUserReels;
