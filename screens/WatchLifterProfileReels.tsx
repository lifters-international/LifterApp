import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
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

    const { loading, errors, data, getReelsInformation, likeReel, saveReel, updateCaption, deleteReel, downloadReel } = useWatchLifterProfileReels(token);

    const scrollViewRef = useRef<ScrollView>(null);

    const [ scrollPos, setScrollPos ] = useState<{ x: number, y: number, animate: boolean }>({ x: 0, y: 0, animate: true });

    const [ scrollEnabled, setScrollEnabled ] = useState(true);

    const { setTabBarVisiblity } = useTabBarContext();

    const [ isVideoMuted, setMuteVideo ] = useState(false);

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
    }, [ scrollPos ])

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
            >
                {
                    data?.reels.map((reel, index) => (
                        <UserProfileReels 
                            key={`lifter-reels-${index}`} 
                            {...reel} 
                            shouldPlay={ scrollPos.y / verticalScale(660) === index } 
                            userId={data!.id}
                            getReelsInformation={getReelsInformation} 
                            likeReel={likeReel}
                            saveReel={saveReel}
                            allowEdit={true}
                            updateCaption={updateCaption}
                            allowDelete={true}
                            deleteReel={deleteReel}
                            downloadReel={downloadReel}
                            isVideoMuted={isVideoMuted}
                            toggleMuteVideo={ ( mute?: boolean ) => setMuteVideo(mute || !isVideoMuted) }
                            enableScroll={ () => setScrollEnabled(true) }
                            disableScroll={ () => setScrollEnabled(false) }
                        />
                    ))
                }
            </ScrollView>
        </AppLayout>
    );
}

export default WatchLifterProfileReels;
