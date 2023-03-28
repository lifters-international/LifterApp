import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Linking } from "react-native";

import { ResizeMode, Video } from "expo-av";
import { moderateScale, returnImageSource, scale, shortenNumber, shortenText, verticalScale } from "../utils";

import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons, EvilIcons, Feather, Entypo } from '@expo/vector-icons';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { HeightMoveAbleView } from "./HeightMoveAbleView";

import { DotLoader } from './DotLoading';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';

type Props = {
    shouldPlay: boolean;
    video_url: string;
    id: string;
    caption: string;
    userId: string;
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    savesCount?: number;
    downloadsCount?: number;
    ownerProfilePicture?: string;
    ownerName?: string;
    userLiked?: boolean;
    userSaved?: boolean;
    getReelsInformation: (reel: string, userId: string) => void;
    likeReel: (reel: string, userId: string) => void;
    saveReel: (reel: string, userId: string) => void;
    downloadReel: (reel: string, userId: string) => void;

    isVideoMuted: boolean;
    toggleMuteVideo: (mute?: boolean) => void;

    allowEdit?: boolean;
    updateCaption?: (reel: string, caption: string, userId: string) => void;

    allowDelete?: boolean;
    deleteReel?: (reel: string, userId: string) => void;

    disableScroll?: () => void;
    enableScroll?: () => void;
}

export const UserProfileReels: React.FC<Props> = ({ ownerProfilePicture, ownerName, userLiked, userSaved, shouldPlay, video_url, id, userId, caption, sharesCount, savesCount, downloadsCount, likesCount, commentsCount, getReelsInformation, likeReel, saveReel, allowEdit, updateCaption, allowDelete, deleteReel, isVideoMuted, toggleMuteVideo, disableScroll, enableScroll, downloadReel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState("");

    const [playVideo, setPlayVideo] = useState(true);

    const [lastPressed, setLastPressed] = useState(0);

    const [commentUp, setCommentUp] = useState(false);

    const [downloadingReel, setDownloadingReel] = useState(false);

    const [ImagePermissionStatus, requestImagePermission] = ImagePicker.useMediaLibraryPermissions();

    const [toggleSaveDownload, setToggleSaveDownload] = useState(false);

    const DOUBLE_PRESS_DELAY = 200;

    const notEditing = <Text style={{ color: "white", fontSize: moderateScale(20) }}>{caption}</Text>


    useEffect(() => {
        if (commentUp) disableScroll!();
        else enableScroll!();
    }, [commentUp]);

    const captionHolder = (
        <>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Image source={returnImageSource(ownerProfilePicture || "/defaultPicture.png")} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />
                    <Text style={{ color: "white", fontSize: moderateScale(20) }}>{shortenText(ownerName || "default_user")}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row" }}>
                    {allowEdit && <MaterialCommunityIcons name="progress-pencil" size={moderateScale(30)} color="#FF3636" onPress={() => setIsEditing(true)} style={{ marginRight: moderateScale(18) }} />}
                    {allowDelete && <EvilIcons name="trash" size={moderateScale(40)} color="#FF3636" onPress={() => deleteReel!(id, userId)} />}
                </View>
            </View>

            {
                !isEditing ? notEditing
                    : !allowEdit ? notEditing
                        : (

                            <TextInput
                                placeholder={caption}
                                style={{ color: "white" }}
                                value={editingText}
                                onChangeText={
                                    (text) => {
                                        setEditingText(text);
                                    }
                                }
                                autoFocus={true}
                                returnKeyType="default"
                                onSubmitEditing={() => {
                                    updateCaption!(id, editingText, userId);
                                    setIsEditing(false);
                                    setEditingText("");
                                }}
                            />
                        )
            }
        </>
    )

    useEffect(() => {
        getReelsInformation(id, userId);
    }, [])

    return (
        <View>
            {
                isEditing ? (
                    <KeyboardAwareScrollView style={{ backgroundColor: "black", position: "absolute", bottom: verticalScale(200), zIndex: 4, width: scale(350), height: verticalScale(300), opacity: 0.5, borderRadius: moderateScale(10), padding: moderateScale(10) }} extraScrollHeight={verticalScale(0)}>
                        {captionHolder}
                    </KeyboardAwareScrollView>
                ) : (
                    <ScrollView scrollEnabled={commentUp} style={{ backgroundColor: "black", position: "absolute", bottom: 0, zIndex: 4, width: scale(350), height: verticalScale(80), opacity: 0.5, borderRadius: moderateScale(10), padding: moderateScale(10) }}>
                        {captionHolder}
                    </ScrollView>
                )
            }

            <TouchableOpacity
                style={{ backgroundColor: "transparent" }}
                onLongPress={() => {
                    setPlayVideo(false);
                    toggleMuteVideo(false);
                }}

                onPressOut={() => {
                    setPlayVideo(true);
                }}

                onPressIn={() => {
                    const time = new Date().getTime();
                    const delta = time - lastPressed;
                    setLastPressed(time);
                    if (lastPressed) {
                        if (delta < DOUBLE_PRESS_DELAY) {
                            likeReel(id, userId);
                            toggleMuteVideo(false);
                        } else {
                            toggleMuteVideo();
                        }
                    }
                }}

                delayLongPress={350}
                touchSoundDisabled
                disabled={commentUp}
            >
                <Video
                    source={returnImageSource(video_url)}
                    style={{ width: scale(350), height: verticalScale(660) }}
                    resizeMode={ResizeMode.STRETCH}
                    useNativeControls={false}
                    isLooping
                    shouldPlay={playVideo && shouldPlay}
                    isMuted={isVideoMuted}
                />
            </TouchableOpacity>

            <View style={{ position: "absolute", top: verticalScale( toggleSaveDownload ? 120 : 220 ), right: 0 }}>
                <View style={{ marginBottom: moderateScale(12) }}>
                    {
                        userLiked ? <AntDesign name="heart" size={moderateScale(40)} color="#FF3636" onPress={() => likeReel(id, userId)} />
                            : <Ionicons name="ios-heart-outline" size={moderateScale(40)} color="white" onPress={() => likeReel(id, userId)} />
                    }
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(likesCount || 0)}</Text>
                </View>

                <View style={{ marginBottom: moderateScale(12) }}>
                    <FontAwesome name="comment-o" size={moderateScale(40)} color="white" onPress={() => setCommentUp(true)} />
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(commentsCount || 0)}</Text>
                </View>

                <View style={{ marginBottom: moderateScale(12) }}>
                    <FontAwesome5 name="share" size={moderateScale(40)} color="white" />
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(sharesCount || 0)}</Text>
                </View>

                <Entypo name="dots-three-horizontal" size={moderateScale(38)} color="white" style={{ marginBottom: moderateScale(12) }} onPress={ () => setToggleSaveDownload(!toggleSaveDownload) }/>

                {
                    toggleSaveDownload && (
                        <>
                            <View style={{ marginBottom: moderateScale(12) }}>
                                {
                                    userSaved ? <FontAwesome name="bookmark" size={moderateScale(40)} color="#FF3636" style={{ position: "relative", left: scale(5) }} onPress={() => saveReel(id, userId)} />
                                        : <FontAwesome name="bookmark-o" size={moderateScale(40)} color="white" style={{ position: "relative", left: scale(5) }} onPress={() => saveReel(id, userId)} />
                                }
                                <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(savesCount || 0)}</Text>
                            </View>

                            <Feather name="download" size={moderateScale(40)} color="white" style={{ marginBottom: moderateScale(12) }}
                                onPress={
                                    async () => {
                                        const { status, canAskAgain, granted } = await requestImagePermission();

                                        if (!canAskAgain && !granted) {
                                            return Alert.alert(
                                                "Photo permision denied",
                                                "Please go to Settings > Privacy > Photos and allow access to Photos",
                                                [
                                                    {
                                                        text: "Okay",
                                                        onPress: () => {
                                                            if (Platform.OS == "ios") Linking.openURL("app-settings:");
                                                            else if (Platform.OS == "android") IntentLauncher.startActivityAsync('android.settings.APPLICATION_DETAILS_SETTINGS', {
                                                                data: "package:" + Application.applicationId
                                                            })
                                                        }
                                                    }
                                                ]
                                            );
                                        }

                                        else if (status !== "granted") {
                                            return alert("We need access to your camera roll. Can't download video.")
                                        }

                                        setDownloadingReel(true);

                                        let dots = video_url.split(".") as string[];
                                        let mimeType = dots[dots.length - 1];

                                        const fileUri: string = `${FileSystem.documentDirectory}${ownerName}.${mimeType}`;
                                        const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(video_url, fileUri);

                                        if (downloadedFile.status != 200) {
                                            return;
                                        }

                                        try {
                                            const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
                                            const album = await MediaLibrary.getAlbumAsync("LiftersHome");

                                            if (album == null) {
                                                await MediaLibrary.createAlbumAsync("LiftersHome", asset, false);
                                            } else {
                                                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                                            }

                                            downloadReel!( id, userId );

                                        } catch (e) {
                                            Alert.alert("Problem downloading video")
                                        }

                                        setDownloadingReel(false);
                                    }
                                }

                            />
                        </>
                    )
                }

            </View>

            {
                downloadingReel && (
                    <View style={{ backgroundColor: "rgb(16, 16, 16)", position: "absolute", width: scale(300), height: verticalScale(100), top: verticalScale(250), left: scale(20), borderRadius: moderateScale(10), padding: moderateScale(10), zIndex: 11 }}>
                        <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(15) }}>Downloading {ownerName}'s reel</Text>
                        <DotLoader style={{ alignSelf: "center", marginTop: moderateScale(10) }} />
                    </View>
                )
            }

            {
                commentUp && (
                    <HeightMoveAbleView
                        style={{ backgroundColor: "black", width: scale(350) }}
                        minHeight={verticalScale(200)}
                        starterHeight={verticalScale(450)}
                        maxHeight={verticalScale(600)}
                        onHeightMove={(height) => {
                            if (height <= verticalScale(200)) setCommentUp(false);
                        }}
                    >


                    </HeightMoveAbleView>
                )
            }
        </View>
    )
}

UserProfileReels.defaultProps = {
    allowEdit: false,
    updateCaption: (reel: string, caption: string, userId: string) => { },

    allowDelete: false,
    deleteReel: (reel: string, userId: string) => { },

    disableScroll: () => { },
    enableScroll: () => { },
}
