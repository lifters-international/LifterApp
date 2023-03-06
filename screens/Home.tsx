import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, ScrollView, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
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

const Home: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    useNotifications(token);

    const { navProps, resetNavProps } = useTabBarContext();

    const [ reset, setReset ] = useState(false);

    const [videoSearch, setVideoSearch] = useState("");

    const searchVideos = useSearchVideo(token);

    useEffect(() => {
        searchVideos.setSearchTerm(videoSearch)
    }, [ videoSearch ])

    useEffect(() => {
        if ( reset ) {
            resetNavProps();
            setReset(false);
        } else {
            const unsubscribe = navigation.addListener('focus', () => {
                if ( !reset ) {
                    if (navProps.open === "Message") {
                        navigation.navigate("Message", {
                            screen: "Messages",
                            params: navProps
                        });
                        setReset(true);
                    } else if (navProps.open === "TrainerPage") {
                        setReset(true);
                        navigation.navigate({ name: "TrainerPage", params: { trainer: navProps.trainerId } });
                    }
                }
            });

            return unsubscribe
        }
    }, [ reset ]);

    if (searchVideos.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <View style={styles.Headercontainer}>
                <View style={styles.SearchBar}>
                    <Ionicons
                        name="search"
                        size={moderateScale(35)}
                        color="#5e5c5c"
                        style={{
                            width: scale(35),
                            height: verticalScale(35),
                            textDecorationColor: "black",
                            position: "relative",
                            top: verticalScale(3.5),
                        }}
                    />
                    <TextInput placeholder="Search Workouts" style={styles.SearchInput} value={videoSearch} onChangeText={query => setVideoSearch(query)} placeholderTextColor="#8f8d8d" />

                </View>

                <Ionicons name="mail" size={moderateScale(40)} color="#FF3636" style={styles.persona} onPress={() => navigation.navigate("Message")} />
                <Zocial name="persona" size={moderateScale(30)} color="#FF3636" style={styles.persona} onPress={() => navigation.navigate("Trainers")} />
            </View>

            {
                searchVideos.data.length !== 0 ? (
                    <ScrollView style={styles.scrollView}>
                        {
                            searchVideos.data.map( ( video, index ) => (
                                <VideoSummary {...video} key={index} 
                                    onClick={() => {
                                        if ( ( video.clientOnly && video.isClient ) || !video.clientOnly ) navigation.navigate("WatchVideo", { videoId: video.id });
                                        else {
                                            Alert.alert(`Become ${video.trainerName}'s Client`, "Can't Watch A Client Only Video", [
                                                {
                                                    text: "Close",
                                                    style: "cancel"
                                                },

                                                {
                                                    text: "Become Client",
                                                    onPress: () => navigation.navigate("BecomeClient", { trainer: video.trainerId  })
                                                }
                                            ])
                                        }
                                    }}
                                    onProfileTouch={
                                        () => navigation.navigate("TrainerPage", { trainer: video.trainerId })
                                    }
                                />
                            ))
                        }
                    </ScrollView>
                ) : (
                    (
                        <View style={styles.NoVideosView}>
                            <Text style={{ color: "white", textAlign: "center" }}>No Videos Found</Text>
                        </View>
                    )
                )
            }
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Headercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    SearchBar: {
        marginTop: moderateScale(10),
        width: "68%",
        height: verticalScale(48),
        display: "flex",
        flexDirection: "row",
        borderRadius: moderateScale(5),
        padding: moderateScale(2),
        borderBottomWidth: moderateScale(1),
        borderColor: "#5e5c5c",
    },

    SearchInput: {
        width: "100%",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        color: "#8f8d8d",
        fontSize: moderateScale(22),
    },

    persona: {
        width: scale(50),
        transform: [{ rotateY: "180deg" }],
        height: verticalScale(50),
        position: "relative",
        top: verticalScale(10)
    },

    NoVideosView: {
        backgroundColor: "rgb(27, 27, 27)",
        borderRadius: 10,
        padding: 10,
        width: moderateScale(300),
        marginRight: "auto",
        marginLeft: "auto",
        position: "relative",
        top: verticalScale(200)
    },

    scrollView: {
        height: verticalScale(700)
    }

});

export default Home;
