import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, Platform, Linking, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode, Audio } from 'expo-av';

import { AppLayout, Button, Loading } from "../components";

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher'
import { getReelsUploadApi, moderateScale, returnImageSource, scale, verticalScale } from "../utils";
import { useCreateReels } from "../hooks";

interface Props {
    navigation: NavigationProp<any>;
}

const CreateReels: React.FC<Props> = ({ navigation }) => {
    const { token, profilePicture } = useSelector((state: any) => state.Auth);
    const [ImagePermissionStatus, requestImagePermission] = ImagePicker.useMediaLibraryPermissions();

    const [loading, setLoading] = useState(false);

    const [createReelState, setCreateReelState] = useState<{ url: string, caption: string }>({ caption: "", url: "" });

    const { loading: Uploading, doneUploading, error, upload } = useCreateReels(token);

    const video = useRef<Video>(null);
    const [stateVideoPlaying, setStateVideoPlaying] = useState(false);

    const [editingState, setEditingState] = useState(false);


    const pickImage = async () => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const { status, canAskAgain, granted } = await requestImagePermission();

        if (!canAskAgain && !granted) {
            return Alert.alert(
                "Permision denied",
                "Please go to Settings > Privacy > Photos and allow access to Photos",
                [
                    {
                        text: "Okay",
                        onPress: () => {
                            if (Platform.OS == "ios") Linking.openURL("app-settings:");
                            else if (Platform.OS == "android") IntentLauncher.startActivityAsync('android.settings.APPLICATION_DETAILS_SETTINGS', {
                                data: "package:" + Application.applicationId
                            })

                            navigation.goBack();
                        }
                    }
                ]
            );
        }

        else if (status !== 'granted') {
            return Alert.alert(
                "Upload Reel Failed. We need access to your camera roll.",
                "Please go to Settings > Privacy > Photos and allow access to Photos",
                [
                    {
                        text: "Okay",
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            )
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (result.cancelled) {
            navigation.goBack();
            return;
        };

        setLoading(true);

        const upRes = await FileSystem.uploadAsync(
            getReelsUploadApi(),
            result.uri,
            {
                httpMethod: "POST",
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                fieldName: "video",
                parameters: {
                    token
                }
            }
        )

        const jsonRes = JSON.parse(upRes.body);

        if (jsonRes.url) {
            setCreateReelState(prev => (
                {
                    ...prev,
                    url: jsonRes.url
                }
            ))
        } else {
            return Alert.alert(
                "Upload Profile Picture Failed",
                "Please try again.",
                [
                    {
                        text: "Okay",
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            );
        }

        setLoading(false);
    }

    useEffect(() => {
        pickImage();
    }, []);

    useEffect(() => {
        if ( doneUploading && !error ) {
            navigation.goBack();
        }
    }, [ doneUploading ]);

    if (loading || Uploading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if ( error ) {
        return (
            <View style={{ backgroundColor: "rgb(16, 16, 16)", width: scale(250), height: verticalScale(60), marginRight: "auto", marginLeft: "auto", borderRadius: moderateScale(10), position: "relative", top: verticalScale(250) }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: moderateScale(20), marginTop: moderateScale(15) }}>An Error occured uploading reel.</Text>
            </View>
        )
    }

    return (
        <AppLayout backgroundColor="black">
            {
                createReelState.url.length === 0 ? <View></View> : (
                    <View>
                        <Feather name="x" size={moderateScale(50)} color="white" style={{ position: "absolute", zIndex: 2 }} onPress={() => pickImage()} />
                        <MaterialIcons name="navigate-next" size={moderateScale(50)} color="white" style={{ position: "absolute", right: 0, zIndex: 2 }} onPress={ () => setEditingState(true) } />
                        <Video
                            ref={video}
                            source={returnImageSource(createReelState.url)}
                            style={{ width: scale(370), height: verticalScale(570), alignSelf: "center", borderRadius: moderateScale(10), padding: moderateScale(10) }}
                            resizeMode={ResizeMode.STRETCH}
                            useNativeControls={false}
                        />
                        <Ionicons name={!stateVideoPlaying ? "ios-play-circle-sharp" : "ios-pause-circle-sharp"} size={moderateScale(50)} color="white" style={{ position: "absolute", bottom: 0, left: scale(160), zIndex: 2 }} onPress={
                            () => {
                                stateVideoPlaying ? video.current?.pauseAsync() : video.current?.playAsync();

                                setStateVideoPlaying(!stateVideoPlaying);
                            }
                        } />

                        {
                            editingState && (
                                <TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ backgroundColor: "#141414", width: scale(300), height: verticalScale(250), position: "absolute", top: verticalScale(120), left: scale(30), zIndex: 5, borderRadius: moderateScale(10), padding: moderateScale(10) }}>
                                    <Text style={{ color: "white", fontSize: moderateScale(20), textAlign: "center" }}>Caption</Text>
                                    <TextInput
                                        style={{
                                            width: scale(280),
                                            borderWidth: moderateScale(2),
                                            borderColor: "#222121",
                                            borderRadius: moderateScale(10),
                                            padding: moderateScale(10),
                                            marginTop: moderateScale(10),
                                            marginBottom: moderateScale(10),
                                            fontSize: moderateScale(15),
                                            color: "white"
                                        }}
                                        value={createReelState.caption}
                                        multiline
                                        keyboardType="default"
                                        onChangeText={(text: string) => {
                                            setCreateReelState(prev => (
                                                {
                                                    ...prev,
                                                    caption: text
                                                }
                                            ))
                                        }}
                                        placeholderTextColor="white"
                                    />
                                    <View style={{ position: "relative", bottom: verticalScale(-90), display: "flex", flexDirection: 'row', justifyContent: "space-between" }}>
                                        <Button
                                            title="Cancel"
                                            textStyle={{ color: "white", fontSize: moderateScale(20) }}
                                            style={{ backgroundColor: "#2c2c2c", width: scale(80), padding: moderateScale(10), borderRadius: moderateScale(10), alignItems: "center" }}
                                            onPress={
                                                () => {
                                                    setEditingState(false);
                                                    setCreateReelState(prev => (
                                                        {
                                                            ...prev,
                                                            caption: ""
                                                        }
                                                    ))
                                                }
                                            }
                                        />
                                        <Button
                                            title="Create"
                                            textStyle={{ color: "white", fontSize: moderateScale(20) }}
                                            style={{ backgroundColor: "#FF3636", width: scale(80), padding: moderateScale(10), borderRadius: moderateScale(10), alignItems: "center" }}
                                            onPress={() =>{
                                                upload(createReelState);
                                            }}
                                        
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                )
            }
        </AppLayout>
    )
}

export default CreateReels;
