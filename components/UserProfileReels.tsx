import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Linking, Share } from "react-native";

import { ResizeMode, Video } from "expo-av";
import { WatchLifterProfileReelsComments, GetLoggedInUserHomePageDetailsReels, WatchLifterProfileReelsCommentsChildren, moderateScale, returnImageSource, scale, shortenNumber, shortenText, verticalScale, ReelsManagerListenerEvents } from "../utils";

import { MangerListener } from "../hooks";

import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons, EvilIcons, Feather, Entypo } from '@expo/vector-icons';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { HeightMoveAbleView } from "./HeightMoveAbleView";

import { DotLoader } from './DotLoading';

import { LifterReelsComment } from './LifterReelsComment';

import Button from './Button';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';

type Props = {
    componentData: {
        userId: string;
        usersProfilePicture: string;
        shouldPlay: boolean;
        isVideoMuted: boolean;
        allowEdit?: boolean;
        allowDelete?: boolean;
    };

    functions: {
        getReelsInformation: (reel: string, userId: string) => void;
        likeReel: (reel: string, userId: string) => void;
        saveReel: (reel: string, userId: string) => void;
        downloadReel: (reel: string, userId: string) => void;
        getParentComments: (reel: string) => void;
        askForChildren: (reel: string, parentComment: string) => void;
        postComment: ( reel: string, userId: string, comment: string, parentId?: string ) => void;
        toggleMuteVideo: (mute?: boolean) => void;
        updateCaption?: (reel: string, caption: string, userId: string) => void;
        deleteReel?: (reel: string, userId: string) => void;
        disableScroll?: () => void;
        enableScroll?: () => void;
        shareReel: (reel: string, userId: string) => void;
        subscribeToEvent: (event: ReelsManagerListenerEvents, listener: MangerListener) => void;
        unSubscribeToEvent: (event: ReelsManagerListenerEvents, id: string) => void;
        createViewHistory: ( reel: string, userId: string ) => void;
        updateViewHistory: ( reel: string, userId: string, time: number ) => void;
    };

    reel: GetLoggedInUserHomePageDetailsReels;
};

export const UserProfileReels: React.FC<Props> = ({ reel, functions, componentData }) => {
    const [reelData, setReelData] = useState<GetLoggedInUserHomePageDetailsReels>(Object.assign({}, reel));
    const [comments, setComments] = useState<{ [ key: string ]: WatchLifterProfileReelsComments }>({});
    const [commentsLoading, setCommentsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState("");

    const [playVideo, setPlayVideo] = useState(true);

    const [lastPressed, setLastPressed] = useState(0);

    const [commentUp, setCommentUp] = useState(false);

    const [fullCommentUp, setFullCommentUp] = useState(false);

    const [downloadingReel, setDownloadingReel] = useState(false);

    const [ImagePermissionStatus, requestImagePermission] = ImagePicker.useMediaLibraryPermissions();

    const [toggleSaveDownload, setToggleSaveDownload] = useState(false);

    const [commentText, setCommentText] = useState("");

    const [ viewHistoryToken, setViewHistoryToken ] = useState("");

    const [ secondsWatched, setSecondsWatched ] = useState(0);

    const DOUBLE_PRESS_DELAY = 200;

    const notEditing = <Text style={{ color: "white", fontSize: moderateScale(20) }}>{reelData.caption}</Text>

    const captionHolder = (
        <>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Image source={returnImageSource(reelData.ownerProfilePicture || "/defaultPicture.png")} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />
                    <Text style={{ color: "white", fontSize: moderateScale(20) }}>{shortenText(reelData.ownerName || "default_user")}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row" }}>
                    {componentData.allowEdit && <MaterialCommunityIcons name="progress-pencil" size={moderateScale(30)} color="#FF3636" onPress={() => setIsEditing(true)} style={{ marginRight: moderateScale(18) }} />}
                    {componentData.allowDelete && <EvilIcons name="trash" size={moderateScale(40)} color="#FF3636" onPress={() => functions.deleteReel!(reelData.id, componentData.userId)} />}
                </View>
            </View>

            {
                !isEditing ? notEditing
                    : !componentData.allowEdit ? notEditing
                        : (

                            <TextInput
                                placeholder={reelData.caption}
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
                                    functions.updateCaption!(reelData.id, editingText, componentData.userId);
                                    setIsEditing(false);
                                    setEditingText("");
                                }}
                            />
                        )
            }
        </>
    )

    useEffect(() => {
        if (commentUp) {
            setCommentsLoading(true);
            functions.getParentComments(reelData.id);
            functions.disableScroll!();
        }
        else functions.enableScroll!();
    }, [commentUp]);

    useEffect(() => {
        functions.updateViewHistory(reelData.id, componentData.userId, secondsWatched );
    }, [ secondsWatched ]);

    useEffect(() => {
        functions.subscribeToEvent(ReelsManagerListenerEvents.reelInformationResponse, {
            id: reelData.id,
            emit: (reelsInformation: { reel: string, likeCount: number, commentsCount: number, sharesCount: number, savesCount: number, downloadsCount: number, ownerProfilePicture: string, ownerName: string, userLiked: boolean, userSaved: boolean }) => {
                setReelData(
                    prev => ({
                        ...prev,
                        ...reelsInformation,
                        reel: undefined
                    })
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.newReelLike, {
            id: reelData.id,
            emit: (reelLikeEvent: { reel: string, userId: string, like: boolean }) => {
                setReelData(
                    prev => {
                        let likesCount = (prev.likesCount || 0) + (reelLikeEvent.like === true ? 1 : -1);

                        likesCount = likesCount > 0 ? likesCount : 0;

                        return {
                            ...prev,
                            likesCount,
                            userLiked: componentData!.userId !== reelLikeEvent.userId ?
                                prev.userLiked : reelLikeEvent.like
                        }
                    }
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.newReelSave, {
            id: reelData.id,
            emit: (reelLikeSave: { reel: string, userId: string, save: boolean }) => {
                setReelData(
                    prev => {
                        let savesCount = (prev.likesCount || 0) + (reelLikeSave.save === true ? 1 : -1);

                        savesCount = savesCount > 0 ? savesCount : 0;

                        return {
                            ...prev,
                            savesCount,
                            userSaved: componentData!.userId !== reelLikeSave.userId ?
                                prev.userSaved : reelLikeSave.save
                        }
                    }
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.reelCaptionUpdated, {
            id: reelData.id,
            emit: (reelsCaptionUpdatedEvent: { reel: string, caption: string }) => {
                setReelData(
                    prev => ({
                        ...prev,
                        caption: reelsCaptionUpdatedEvent.caption
                    })
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.parentComments, {
            id: reelData.id,
            emit: (parentCommentsEvent: { reel: string, comments: WatchLifterProfileReelsComments[] }) => {
                setCommentsLoading(false);
                setComments(
                    Object.assign({}, ...parentCommentsEvent.comments.map( comment => ({ [comment.id]: comment }) ) )
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.childComments, {
            id: reelData.id,
            emit: ( childCommentsEvent: { reel: string, parentComment: string, childComments: WatchLifterProfileReelsCommentsChildren[] } ) => {
                setComments(
                    prev => ({
                        ...prev,
                        [ childCommentsEvent.parentComment ]: {
                            ...prev[ childCommentsEvent.parentComment as string ],
                            children: childCommentsEvent.childComments
                        }
                    })
                );
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.newComment, {
            id: reelData.id,
            emit: ( newCommentEvent: { id: string, comment: string, reel: string, user : string, liftersProfilePicture: string, liftersName: string, updated_at: number } ) => {
                setComments( prev => ({
                    ...prev,
                    [newCommentEvent.id]: {
                        id: newCommentEvent.id,
                        comment: newCommentEvent.comment,
                        liftersId: newCommentEvent.user,
                        liftersName: newCommentEvent.liftersName,
                        liftersProfilePicture: newCommentEvent.liftersProfilePicture,
                        updated_at: newCommentEvent.updated_at,
                        childrenCount: 0,
                        children: []
                    }
                }));

                setReelData( prev => ({
                    ...prev,
                    commentsCount: ( prev.commentsCount || 0 ) + 1
                }));
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.newChildComment, {
            id: reelData.id,
            emit: ( newChildCommentEvent : { id: string, comment: string, reel: string, user : string, liftersProfilePicture: string, liftersName: string, updated_at: number, parentId: string, parent: string, ancestorId: string } ) => {
                setComments( prev => ({
                    ...prev,
                    [newChildCommentEvent.ancestorId]: {
                        ...prev[newChildCommentEvent.ancestorId],
                        children: [
                            ...( prev[newChildCommentEvent.ancestorId].children || []),
                            {
                                id: newChildCommentEvent.id,
                                comment: newChildCommentEvent.comment,
                                liftersId: newChildCommentEvent.user,
                                liftersName: newChildCommentEvent.liftersName,
                                liftersProfilePicture: newChildCommentEvent.liftersProfilePicture,
                                updated_at: newChildCommentEvent.updated_at,
                                parentId: newChildCommentEvent.parentId,
                                childrenCount: 0,
                                children: []
                            }
                        ],
                        childrenCount: prev[newChildCommentEvent.ancestorId].childrenCount + 1
                    }
                }));

                setReelData( prev => ({
                    ...prev,
                    commentsCount: ( prev.commentsCount || 0 ) + 1
                }));
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.newReelShare, {
            id: reelData.id,
            emit: ( newReelShareEvent : { reel: string }) => {
                setReelData(
                    prev => ({
                        ...prev,
                        sharesCount: ( prev.sharesCount || 0 ) + 1
                    })
                )
            }
        });

        functions.subscribeToEvent(ReelsManagerListenerEvents.viewHistoryToken, {
            id: reelData.id,
            emit: ( viewHistoryTokenEvent: { reel: string, token: string }) => {
                setViewHistoryToken( viewHistoryTokenEvent.token );
            }
        });

        functions.getReelsInformation(reelData.id, componentData.userId);
        functions.createViewHistory(reelData.id, componentData.userId);

        const interval = setInterval( () => setSecondsWatched( prev => prev + 1 ), 1000 );

        return () => {
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.reelInformationResponse, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.newReelLike, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.newReelSave, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.reelCaptionUpdated, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.parentComments, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.childComments, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.newComment, reelData.id);
    
            functions.unSubscribeToEvent(ReelsManagerListenerEvents.newChildComment, reelData.id);

            functions.unSubscribeToEvent(ReelsManagerListenerEvents.viewHistoryToken, reelData.id);

            clearInterval(interval);
        }
    }, []);

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
                    functions.toggleMuteVideo(false);
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
                            functions.likeReel(reelData.id, componentData.userId);
                            functions.toggleMuteVideo(false);
                        } else {
                            functions.toggleMuteVideo();
                        }
                    }
                }}

                delayLongPress={350}
                touchSoundDisabled
                disabled={commentUp}
            >
                <Video
                    source={returnImageSource(reelData.video_url)}
                    style={{ width: scale(350), height: verticalScale(660) }}
                    resizeMode={ResizeMode.STRETCH}
                    useNativeControls={false}
                    isLooping
                    shouldPlay={playVideo && componentData.shouldPlay}
                    isMuted={componentData.isVideoMuted}
                />
            </TouchableOpacity>

            <View style={{ position: "absolute", top: verticalScale(toggleSaveDownload ? 120 : 220), right: 0 }}>
                <View style={{ marginBottom: moderateScale(12) }}>
                    {
                        reelData.userLiked ? <AntDesign name="heart" size={moderateScale(40)} color="#FF3636" onPress={() => functions.likeReel(reelData.id, componentData.userId)} />
                            : <Ionicons name="ios-heart-outline" size={moderateScale(40)} color="white" onPress={() => functions.likeReel(reelData.id, componentData.userId)} />
                    }
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(reelData.likesCount || 0)}</Text>
                </View>

                <View style={{ marginBottom: moderateScale(12) }}>
                    <FontAwesome name="comment-o" size={moderateScale(40)} color="white" onPress={() => setCommentUp(true)} />
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(reelData.commentsCount || 0)}</Text>
                </View>

                <View style={{ marginBottom: moderateScale(12) }}>
                    <FontAwesome5 name="share" size={moderateScale(40)} color="white" 
                        onPress={ async () => {
                            const result = await Share.share({
                                message: `Come and check out ${reelData.ownerName}'s reel on LiftersHome... The #1 Home For All GYM People!!!`,
                                url: `https://www.lifters.app/reels/${reelData.id}`
                            });

                            if ( result.action === "sharedAction" ) {
                                functions.shareReel( reelData.id, componentData.userId );
                            }
                        }}
                    />
                    <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(reelData.sharesCount || 0)}</Text>
                </View>

                <Entypo name="dots-three-horizontal" size={moderateScale(38)} color="white" style={{ marginBottom: moderateScale(12) }} onPress={() => setToggleSaveDownload(!toggleSaveDownload)} />

                {
                    toggleSaveDownload && (
                        <>
                            <View style={{ marginBottom: moderateScale(12) }}>
                                {
                                    reelData.userSaved ? <FontAwesome name="bookmark" size={moderateScale(40)} color="#FF3636" style={{ position: "relative", left: scale(5) }} onPress={() => functions.saveReel(reelData.id, componentData.userId)} />
                                        : <FontAwesome name="bookmark-o" size={moderateScale(40)} color="white" style={{ position: "relative", left: scale(5) }} onPress={() => functions.saveReel(reelData.id, componentData.userId)} />
                                }
                                <Text style={{ textAlign: "center", fontSize: moderateScale(20), color: "white" }}>{shortenNumber(reelData.savesCount || 0)}</Text>
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

                                        let dots = reelData.video_url.split(".") as string[];
                                        let mimeType = dots[dots.length - 1];

                                        const fileUri: string = `${FileSystem.documentDirectory}${reelData.ownerName}.${mimeType}`;
                                        const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(reelData.video_url, fileUri);

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

                                            functions.downloadReel!(reelData.id, componentData.userId)

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
                        <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(15) }}>Downloading {reelData.ownerName}'s reel</Text>
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
                            setFullCommentUp(
                                height == verticalScale(600)
                            )
                        }}
                    >
                        <KeyboardAwareScrollView>
                            {
                                commentsLoading ? <DotLoader style={{ alignSelf: "center", marginTop: moderateScale(10) }} />
                                    : (
                                        <>
                                            <ScrollView style={{ marginTop: moderateScale(20), height: fullCommentUp ? verticalScale(515) : verticalScale(550) }}>
                                                <View onStartShouldSetResponder={ ( event ) => true } >
                                                    {
                                                        Object.values(comments)?.map((comment, index) => (
                                                            <LifterReelsComment
                                                                {...comment}
                                                                key={`com-${index}`}
                                                                profilePicture={componentData.usersProfilePicture}
                                                                askForChildren={(parentComment: string) => {
                                                                    functions.askForChildren(reelData.id, parentComment);
                                                                }}
                                                                removeChildren={ ( id: string ) => { 
                                                                    setComments(
                                                                        prev => ({
                                                                            ...prev,
                                                                            [id]: {
                                                                                ...prev[id],
                                                                                children: []
                                                                            }
                                                                        })
                                                                    )
                                                                }}
                                                                postComment={( comment: string, parentId? : string) => {
                                                                    functions.postComment( reelData.id, componentData.userId, comment, parentId);
                                                                }}
                                                            />
                                                        ))

                                                    }
                                                </View>
                                            </ScrollView>

                                            <View style={{ marginTop: moderateScale(10), height: fullCommentUp ? "20%" : "45%" }}>
                                                <View style={{ display: "flex", flexDirection: "row" }}>
                                                    <Image source={returnImageSource(componentData.usersProfilePicture)} style={{ marginRight: moderateScale(4), borderRadius: moderateScale(50), width: scale(30), height: verticalScale(30) }} resizeMode="stretch" />
                                                    <TextInput
                                                        placeholder="Add a comment"
                                                        style={{ color: "rgb(100, 99, 99)" }}
                                                        value={commentText}
                                                        onChangeText={
                                                            (text) => {
                                                                setCommentText(text)
                                                            }
                                                        }
                                                    />
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", marginTop: moderateScale(10), position: "relative", left: scale(180) }}>
                                                    <Button
                                                        title="Cancel"
                                                        style={{ backgroundColor: "rgb(29, 29, 29)", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                                                        textStyle={{ color: "rgb(143, 143, 143)", fontSize: moderateScale(15) }}
                                                        onPress={() => setCommentText("")}
                                                    />

                                                    <Button
                                                        title="Comment"
                                                        style={{ backgroundColor: "#FF3636", borderRadius: moderateScale(10), padding: moderateScale(10), marginLeft: moderateScale(10) }}
                                                        textStyle={{ color: "white", fontSize: moderateScale(15) }}
                                                        onPress={() => {
                                                            if (commentText.length > 0) {
                                                                functions.postComment(reelData.id, componentData.userId, commentText);
                                                                setCommentText("");
                                                            }
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )
                            }
                        </KeyboardAwareScrollView>
                    </HeightMoveAbleView>
                )
            }
        </View>
    )
}
