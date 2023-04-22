import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Audio } from "expo-av";

import { useWatchLifterProfileReels } from "../hooks";
import { AppLayout, Loading, UserProfileReels } from "../components";

import { moderateScale, scale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const WatchLifterProfileReels: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector((state: any) => state.Auth);

    const [refreshing, setRefreshing] = useState(false);

    const { 
        loading, errors, data, subscribeToEvent, unSubscribeToEvent, postComment, shareReel, getParentComments, 
        getReelsInformation, likeReel, saveReel, updateCaption, deleteReel, downloadReel, askForChildren, 
        createViewHistory, updateViewHistory
    } = useWatchLifterProfileReels(token, refreshing);

    const [ view, setView ] = useState<"saved" | "reels">("reels");

    const scrollViewRef = useRef<ScrollView>(null);

    const [ scrollPos, setScrollPos ] = useState<{ x: number, y: number, animate: boolean }>({ x: 0, y: 0, animate: true });

    const [ scrollEnabled, setScrollEnabled ] = useState(true);

    const { setTabBarVisiblity } = useTabBarContext();

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

            if ( route.params?.viewToShow && scrollViewRef ) {
                let { viewToShow } = route.params;

                setView( viewToShow || "reels" );
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
                    data?.[view == "reels" ? "reels" : "reelsSaves"].map((reel, index) => (
                        <UserProfileReels 
                            key={`lifter-reels-${index}`}

                            componentData={{
                                userId: data!.id,
                                usersProfilePicture: data?.profilePicture,
                                shouldPlay: scrollPos.y / verticalScale(660) === index,
                                isVideoMuted,
                                allowEdit: true,
                                allowDelete: true,
                                track: view == "saved"
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
                                updateViewHistory
                            }}

                            reel={reel}
                        />
                    ))
                }
            </ScrollView>
        </AppLayout>
    );
}

export default WatchLifterProfileReels;
