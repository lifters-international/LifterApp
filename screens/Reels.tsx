import React, { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { Audio } from "expo-av";

import { useSelector } from "react-redux";

import { Loading, AppLayout, UserProfileReels } from "../components";

import { useReels } from "../hooks";
import { moderateScale, verticalScale } from "../utils";

import { useTabBarContext } from "../navigation/Tab";

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const Reels: React.FC<Props> = ({ navigation, route }) => {
    const { token } = useSelector(( state : any ) => state.Auth);
    const [refreshing, setRefreshing] = useState(false);

    const { 
        loading, reels, subscribeToEvent, unSubscribeToEvent, postComment, shareReel, getParentComments, 
        getReelsInformation, likeReel, saveReel, updateCaption, deleteReel, downloadReel, askForChildren, 
        createViewHistory, updateViewHistory, userId, profilePicture, nextReel
    } = useReels(token, refreshing);

    const scrollViewRef = useRef<ScrollView>(null);

    const [ scrollPos, setScrollPos ] = useState<{ x: number, y: number, animate: boolean }>({ x: 0, y: 0, animate: true });

    const [ scrollEnabled, setScrollEnabled ] = useState(true);

    const { setTabBarVisiblity, navigate, navProps, resetNavProps } = useTabBarContext();

    const [ reset, setReset ] = useState(false);

    const [ isVideoMuted, setMuteVideo ] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing( true );
    }, []);

    useEffect( () => {
        reels.length > 0 && setTabBarVisiblity(false);

        return () => {
            return setTabBarVisiblity(true);
        }
    }, []);

    useEffect(() => {
        if ( reset ) {
            resetNavProps();
            setReset(false);
        } else {
            const unsubscribe = navigation.addListener('focus', () => {
                if ( !reset ) {
                    if (navProps.open === "LiftersPage" ) {
                        setReset(true);
                        setTabBarVisiblity(true);
                        navProps.userId != navProps.userIdParam 
                            ? navigation.navigate("UserProfilePage", { userId: navProps.userIdParam }) : navigate("Profile", {})
                    }
                }
            });

            return unsubscribe
        }
    }, [ reset, userId ]);

    const moveToY = ( val : number, animate = true ) => {
        let max = ( ( ( reels.length || 1 ) - 1 )  * verticalScale(660) );

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

            if ( route.params?.scrollToReel && scrollViewRef && loading === false ) {
                let { scrollToReel } = route.params;

                let yIndex = reels.findIndex( r => r.id === scrollToReel ) || 0;

                if ( yIndex != 0 ) moveToY(yIndex * verticalScale(660), false );
            }
        }

        setUp();

    }, [ scrollViewRef, navigation, loading ]);

    useEffect(() => {
        setRefreshing(loading);
    }, [ reels ]);

    if (loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <ScrollView
                ref={scrollViewRef}
                scrollEnabled={scrollEnabled}
                onScrollEndDrag={
                    ( event ) => {
                        if ( event.nativeEvent.velocity!.y < 0 ) {
                            moveToY(scrollPos.y - verticalScale(660));
                            setTabBarVisiblity(true)
                        }else if ( event.nativeEvent.velocity!.y > 0 ) {
                            setTabBarVisiblity(false)
                            moveToY(scrollPos.y + verticalScale(660));
                            nextReel( reels[ reels.length - 1 ]?.id );
                        }
                    }
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {
                    reels.map((reel, index) => (
                        <UserProfileReels 
                            key={`lifter-reels-${index}`}

                            componentData={{
                                userId,
                                usersProfilePicture: profilePicture,
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
                                goToUserProfile: ( userIdParam: string ) => userId != userIdParam ? navigation.navigate("UserProfilePage", { userId: userIdParam }) : navigate("Profile", {})
                            }}

                            reel={reel}
                        />
                    ))
                }

                {
                    reels.length == 0 && (
                        <View style={{ 
                            backgroundColor: "rgb(27, 27, 27)",
                            borderRadius: 10,
                            padding: 10,
                            width: moderateScale(300),
                            marginRight: "auto",
                            marginLeft: "auto",
                            position: "relative",
                            top: verticalScale(200)
                        }}>
                            <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20) }}>No Reels Found</Text>
                        </View>
                    )
                }
            </ScrollView>
        </AppLayout>
    )
}

export default Reels;
