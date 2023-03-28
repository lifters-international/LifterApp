import React, { useState, useEffect, useRef } from "react";

import { View, Text, Image, TextInput, StyleSheet, Share, ScrollView, Alert, Platform, Linking } from "react-native";

import { Video, AVPlaybackStatus, AVPlaybackStatusSuccess, ResizeMode, Audio } from 'expo-av';

import { useSelector } from "react-redux";

import { Loading, AppLayout, Button, VideoSummary, WatchTrainerVideoComment } from "../components";

import { useWatchTrainerVideo, useSignInUserData } from "../hooks";

import { getDiff, shortenNumber, returnImageSource, scale, moderateScale, verticalScale, WatchTrainerVideoV401Comments } from "../utils";

import { AntDesign, Feather } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from "@react-navigation/native";

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';

type Props = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}

const styles = StyleSheet.create({
    sub: {
        backgroundColor: "rgb(12, 12, 12)",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        width: scale(150),
        height: verticalScale(40),
        marginLeft: moderateScale(20)
    },

    subText: { color: "rgb(75, 75, 75)", fontSize: moderateScale(15), textAlign: "center" },

    reactionIconsView: {
        backgroundColor: "hsl(0, 0%, 7%)",
        borderRadius: moderateScale(10),
        padding: moderateScale(2),
        flexDirection: "row"
    },

    reactionIconsText: {
        color: "rgb(85, 85, 85)",
        fontSize: moderateScale(28),
        marginLeft: moderateScale(15)
    }
});

const WatchTrainerVideo: React.FC<Props> = ({ route, navigation }) => {
    const { videoId } = route.params as { videoId: string };
    const { token } = useSelector((state: any) => state.Auth);

    const video = useRef<Video>(null);
    const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus>();

    const watchVideo = useWatchTrainerVideo(token, videoId);

    const signedUser = useSignInUserData(token);

    const [comment, setComment] = useState("");
    const [showAllComment, setShowAllComment] = useState(false);
    
    const [ videoDownloading, setVideoDownloading ] = useState(false);
    const [ ImagePermissionStatus, requestImagePermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect( () => {
        const setUp = async () => {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        }

        setUp();
    }, [ ] );

    useEffect(() => {
        if (videoStatus !== undefined) if ((videoStatus as AVPlaybackStatusSuccess).isPlaying) {
            watchVideo.updateTime((videoStatus as AVPlaybackStatusSuccess).positionMillis)
        }
    }, [videoStatus]);

    if (watchVideo.loading || signedUser.loading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>

    if (watchVideo.error) {
        return (
            <AppLayout backgroundColor="black">
                <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(250), height: verticalScale(60), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>{watchVideo.error}</Text>
                </View>
            </AppLayout>
        )
    }

    let date = new Date(new Date(watchVideo.videoData?.video.date!).toLocaleString());

    return (
        <AppLayout backgroundColor="black">
            <View>
                <Video
                    ref={video}
                    source={returnImageSource(watchVideo.videoData?.video.url!)}
                    style={{ width: "100%", height: verticalScale(220), alignSelf: "center", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    onPlaybackStatusUpdate={status => setVideoStatus(status)}
                    isMuted={false}
                />

                <ScrollView>
                    <View style={{ display: "flex", flexDirection: "column" }}>

                        <View style={{ width: scale(500) }}>
                            <Text style={{ color: "rgb(120, 120, 120)", fontSize: moderateScale(25), marginBottom: verticalScale(15), marginTop: verticalScale(10) }}>{watchVideo.videoData?.video.title}</Text>

                            <View style={{ display: "flex", flexDirection: "column", marginBottom: verticalScale(20) }}>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: verticalScale(20) }}>

                                    <Image source={returnImageSource(watchVideo.videoData?.video.trainerProfile!)} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />

                                    <View style={{ display: "flex", flexDirection: "column", marginLeft: moderateScale(5) }}>

                                        <Button
                                            title={watchVideo.videoData?.video.trainerName!}
                                            onPress={() => navigation.navigate("TrainerPage", { trainer: watchVideo.videoData?.video.trainerId })}
                                            textStyle={{ color: "rgb(75, 75, 75)", fontSize: moderateScale(20) }}
                                        />

                                        <Text style={{ color: "rgb(75, 75, 75)", fontSize: moderateScale(15) }}>{watchVideo.videoData?.video.clientCount} clients</Text>

                                    </View>

                                    {
                                        !watchVideo.videoData?.video.isClient ?
                                            <Button
                                                title="Become Client"
                                                onPress={() => navigation.navigate("BecomeClient", { trainer: watchVideo.videoData?.video.trainerId })}
                                                style={styles.sub}
                                                textStyle={styles.subText}
                                            />
                                            :
                                            <Button
                                                title="UnSubscribe"
                                                onPress={() => navigation.navigate("BecomeClient", { trainer: watchVideo.videoData?.video.trainerId })}
                                                style={styles.sub}
                                                textStyle={styles.subText}
                                            />
                                    }

                                </View>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: verticalScale(20), justifyContent: "space-between", width: scale(350) }}>

                                    {
                                        !watchVideo.videoData?.allowLikes && !watchVideo.videoData?.allowDislikes ? <></> : (
                                            <View style={{ ...styles.reactionIconsView, width: scale(140), justifyContent: "space-between" }}>
                                                {
                                                    watchVideo.videoData?.allowLikes === true && (
                                                        <View style={styles.reactionIconsView}>
                                                            {
                                                                <AntDesign size={moderateScale(30)} name={watchVideo.videoData!.likedVideo ? "like1" : "like2"} color="#FF3636" onPress={() => {
                                                                    if (watchVideo.videoData!.likedVideo) watchVideo.disLikeVideo();
                                                                    else watchVideo.likeVideo();
                                                                }} />
                                                            }
                                                            <Text style={styles.reactionIconsText}>{watchVideo.videoData?.video.likes}</Text>
                                                        </View>
                                                    )
                                                }
                                                {
                                                    watchVideo.videoData?.allowDislikes && (
                                                        <View style={styles.reactionIconsView}>
                                                            {
                                                                <AntDesign size={moderateScale(30)} name={watchVideo.videoData!.dislikedVideo ? "dislike1" : "dislike2"} color="#FF3636" onPress={() => {
                                                                    if (!watchVideo.videoData!.dislikedVideo) watchVideo.disLikeVideo();
                                                                    else watchVideo.likeVideo();
                                                                }} />
                                                            }
                                                            <Text style={styles.reactionIconsText}>{watchVideo.videoData?.video.disLikes}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        )
                                    }


                                    <Feather
                                        size={moderateScale(30)}
                                        color="#FF3636"
                                        name="share"
                                        onPress={async () => {
                                            const result = await Share.share({
                                                message: `Come check out this video by ${watchVideo.videoData?.video.trainerName} on LiftersHome... The #1 Home For All Things GYM!!!`,
                                                url: `https://www.lifters.app/videos/${watchVideo.videoData?.video.id}`
                                            })
                                        }}
                                    />

                                    <View>
                                        {
                                            watchVideo.videoData?.video.isClient ?
                                                !videoDownloading ? (
                                                    <AntDesign size={moderateScale(30)} name="download" color="#FF3636" onPress={async () => {
                                                        const { status, canAskAgain, granted } = await requestImagePermission();

                                                        if ( !canAskAgain && !granted ) {
                                                            return Alert.alert(
                                                                "Photo permision denied", 
                                                                "Please go to Settings > Privacy > Photos and allow access to Photos",
                                                                [
                                                                    {
                                                                        text: "Okay",
                                                                        onPress: () => {
                                                                            if ( Platform.OS == "ios" ) Linking.openURL("app-settings:");
                                                                            else if (Platform.OS == "android") IntentLauncher.startActivityAsync('android.settings.APPLICATION_DETAILS_SETTINGS', {
                                                                                data: "package:"+Application.applicationId
                                                                            })
                                                                        }
                                                                    }
                                                                ]
                                                            );
                                                        }
                                                
                                                        else if ( status !== "granted" ) {
                                                            return alert("We need access to your camera roll. Can't download video.")
                                                        }

                                                        setVideoDownloading(true);

                                                        let dots = watchVideo.videoData?.video.url!.split(".") as string[];
                                                        let mimeType = dots[ dots.length - 1 ];

                                                        const fileUri: string = `${FileSystem.documentDirectory}${watchVideo.videoData?.video.trainerName}-${watchVideo.videoData?.video.title}.${mimeType}`;
                                                        const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(watchVideo.videoData?.video.url!, fileUri);

                                                        if ( downloadedFile.status != 200 ) {
                                                            return;
                                                        }

                                                        try {
                                                            const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
                                                            const album = await MediaLibrary.getAlbumAsync("LiftersHome");

                                                            if ( album == null ) {
                                                                await MediaLibrary.createAlbumAsync("LiftersHome", asset, false);
                                                            }else {
                                                                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                                                            }

                                                            Alert.alert("Video Downloaded")

                                                        } catch ( e ) {
                                                            Alert.alert("Problem downloading video")
                                                        }

                                                        setVideoDownloading(false);

                                                    }} className="icon" />
                                                ) : <AntDesign size={moderateScale(30)} name="loading1" color="#FF3636" /> 
                                                : <></>
                                        }
                                    </View>

                                </View>

                            </View>
                        </View>

                        <View style={{ backgroundColor: "rgb(16, 16, 16)", borderRadius: moderateScale(10), padding: moderateScale(10) }}>
                            <Text style={{ color: "rgb(158, 158, 158)" }}>
                                {shortenNumber((watchVideo.videoData?.video.views || 0) + 1)} views &#8226; &nbsp;
                                {getDiff(date, new Date(new Date().toLocaleString()))} ago
                            </Text>

                            <Text style={{ color: "hsl(0, 1%, 26%)" }}>
                                {watchVideo.videoData?.video.description}
                            </Text>
                        </View>

                        <View style={{ marginTop: moderateScale(10), borderTopWidth: moderateScale(1), borderColor: "rgb(94, 94, 94)" }}>

                            <Text style={{ color: "rgb(100, 99, 99)", marginTop: moderateScale(10) }} >{shortenNumber(watchVideo.videoData?.comments.length!)} Comments</Text>

                            {
                                watchVideo.videoData?.allowComments && (
                                    <View style={{ marginTop: moderateScale(10) }}>
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <Image source={returnImageSource(signedUser.data?.profilePicture!)} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />
                                            <TextInput
                                                placeholder="Add a comment"
                                                style={{ color: "rgb(100, 99, 99)" }}
                                                value={comment}
                                                onChangeText={
                                                    (text) => {
                                                        setComment(text)
                                                    }
                                                }
                                            />
                                        </View>

                                        <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(10), position: "relative", left: scale(180) }}>
                                            <Button
                                                title="Cancel"
                                                style={{ backgroundColor: "rgb(29, 29, 29)", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                                textStyle={{ color: "rgb(143, 143, 143)", fontSize: moderateScale(15) }}
                                                onPress={() => setComment("")}
                                            />

                                            <Button
                                                title="Comment"
                                                style={{ backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10), marginLeft: moderateScale(10) }}
                                                textStyle={{ color: "white", fontSize: moderateScale(15) }}
                                                onPress={() => {
                                                    if (comment.length > 0) {
                                                        watchVideo.postComment(comment);
                                                        setComment("");
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                )
                            }

                            <View style={{}} >
                                {
                                    (
                                        showAllComment || watchVideo.videoData!.comments.length < 5 ?
                                            watchVideo.videoData!.comments!
                                            :
                                            watchVideo.videoData!.comments!.slice(0, 5)
                                    ).map((comment, index) => (
                                        <WatchTrainerVideoComment {...( comment as WatchTrainerVideoV401Comments)} key={`com-${index}`} profilePicture={signedUser.data?.profilePicture!} allowComments={watchVideo.videoData?.allowComments || false} askForChildren={watchVideo.askForChildren} removeChildren={watchVideo.removeChildren} postComment={watchVideo.postComment} />
                                    ))
                                }

                                {
                                    watchVideo.videoData!.comments.length > 5 ?
                                        showAllComment ? <Button
                                            title="Show Less"
                                            onPress={() => setShowAllComment(false)}
                                            textStyle={{ color: "rgb(116, 114, 114)", textAlign: "center" }}
                                            style={{
                                                backgroundColor: "rgb(27, 27, 27)",
                                                borderRadius: moderateScale(10),
                                                padding: moderateScale(10),
                                                marginBottom: moderateScale(30)
                                            }}
                                        />
                                            : <Button
                                                title={`Show ${watchVideo.videoData!.comments.length - 5} more`}
                                                onPress={() => setShowAllComment(true)}
                                                textStyle={{ color: "rgb(116, 114, 114)", textAlign: "center" }}
                                                style={{
                                                    backgroundColor: "rgb(27, 27, 27)",
                                                    borderRadius: moderateScale(10),
                                                    padding: moderateScale(10),
                                                    marginBottom: moderateScale(30)
                                                }}
                                            />
                                        : null
                                }
                            </View>

                        </View>

                        <View style={{ marginBottom: verticalScale(550) }}>
                            {
                                watchVideo.videoData?.recommendedVideos.map((vid: any, index) => (
                                    <VideoSummary {...vid} clientOnly={false} isClient={false} key={index} onClick={() => navigation.setParams({ videoId: vid.id })} />
                                ))
                            }
                        </View>

                    </View>
                </ScrollView>
            </View>

        </AppLayout>
    )
}

export default WatchTrainerVideo;

