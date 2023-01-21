import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground, FlatList, Platform, Linking, Alert } from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher'
import { AppLayout, Button, Loading } from "../components";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { saveToStore, userInformationToSave, getImageUploadApi, returnImageSource, scale, verticalScale, moderateScale } from "../utils";
import { useAppDispatch } from "../redux";
import { setAuthState } from "../redux/features/auth";
import { useSignedInUserData, useSaveUserProfileChanges } from "../hooks";

interface Props {
    navigation: NavigationProp<any>;
}

const Profile: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { token, profilePicture } = useSelector((state: any) => state.Auth);
    const [loading, setLoading] = useState(false);
    const signedInUser = useSignedInUserData(token);
    const saveUserData = useSaveUserProfileChanges();
    const [userData, setUserData] = useState<userInformationToSave>();
    const [ ImagePermissionStatus, requestImagePermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect(() => {
        if (signedInUser.getUserDataSuccess) {
            setUserData({
                username: signedInUser.data?.username,
                email: signedInUser.data?.email,
                age: signedInUser.data?.age,
                gender: signedInUser.data?.gender,
                genderOfPrefense: signedInUser.data?.genderOfPrefense,
                bio: signedInUser.data?.bio,
                profilePicture: signedInUser.data?.profilePicture,
                homeGymLocation: signedInUser.data?.homeGymLocation,
            })
        }
    }, [signedInUser]);

    const pickImage = async () => {
        const { status, canAskAgain, granted } = await requestImagePermission();

        if ( !canAskAgain && !granted ) {
            return Alert.alert(
                "Photo permision denied", 
                "Please go to Settings > Privacy > Photos and allow access to Photos",
                [
                    {
                        text: "Okay",
                        onPress: () => {
                            console.log(Platform.OS)
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
            return alert("Upload Profile Picture Failed. We need access to your camera roll.")
        } 

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (result.cancelled) return;

        setLoading(true);
        const upRes = await FileSystem.uploadAsync(
            getImageUploadApi(),
            result.uri,
            {
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                fieldName: 'image',
                parameters: {
                    'token': token,
                }
            }
        )

        const jsonRes = JSON.parse(upRes.body);

        if (jsonRes.url) {
            await saveUserData.saveAsync({
                token,
                userInfor: {
                    ...( userData || {} ),
                    profilePicture: jsonRes.url
                }
            });
        }else {
            alert("Upload Profile Picture Failed. Please try again.")
        }

        setLoading(false);
    }

    if ( loading ) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <View>
                <View style={styles.EditProfilePicture}>
                    <ImageBackground source={returnImageSource(profilePicture)} style={{ flex: 1, justifyContent: "center" }}>
                        <Button title="Upload New Profile Picture" style={styles.EditProfilePictureButton} textStyle={{ color: "white", fontSize: moderateScale(10) }} onPress={pickImage} />
                    </ImageBackground>
                </View>

                <ScrollView nestedScrollEnabled={true} horizontal={false}>
                    <FlatList
                        horizontal={true}
                        style={styles.EditProfileButtons}
                        data={[
                            {
                                title: saveUserData.isSaving ? "Saving..." : saveUserData.saveSuccessfully ? "Saved!" : "Save",
                                onClick: () => {
                                    saveUserData.save({
                                        token,
                                        userInfor: userData || {}
                                    });
                                },
                            },
                            {
                                title: "Password",
                                onClick: () => {
                                    navigation.navigate("Change Password");
                                },
                            },
                            {
                                title: "Log Out",
                                onClick: async () => {
                                    setLoading(true);
                                    await saveToStore("token", "");
                                    await saveToStore("username", "");
                                    await saveToStore("password", "");
                                    setLoading(false);
                                    dispatch(setAuthState({
                                        token: "",
                                        tokenVerified: false,
                                        username: "",
                                        password: ""
                                    }));
                                },
                            },
                            {
                                title: "Delete Account",
                                onClick: () => {
                                    navigation.navigate("Delete Account");
                                }
                            }
                        ]}
                        renderItem={({ item }) => (
                            <Button title={item.title} style={styles.EditProfileButton} textStyle={{ color: "white", fontSize: moderateScale(10), textAlign: "center" }} onPress={item.onClick} />
                        )}

                    />

                    {
                        [
                            [
                                {
                                    title: "Name",
                                    value: userData?.username,
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            username: text
                                        });
                                    }
                                },

                                {
                                    title: "Email Address",
                                    value: userData?.email,
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            email: text
                                        });
                                    }
                                }
                            ],

                            [
                                {
                                    title: "Gender",
                                    value: userData?.gender,
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            gender: text
                                        });
                                    }
                                },

                                {
                                    title: "Gender of Preference",
                                    value: userData?.genderOfPrefense,
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            genderOfPrefense: text
                                        });
                                    }
                                }
                            ],

                            [
                                {
                                    title: "Age",
                                    value: userData?.age?.toString(),
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            age: parseInt(text) || 0
                                        });
                                    }
                                },

                                {
                                    title: "Home Gym",
                                    value: userData?.homeGymLocation,
                                    onChange: (text: string) => {
                                        setUserData({
                                            ...userData,
                                            homeGymLocation: text
                                        });
                                    }
                                }
                            ]
                        ].map((row, rowIndex) => (
                            <FlatList
                                horizontal={true}
                                style={styles.EditProfileInputJoin}
                                data={row}
                                scrollEnabled={false}
                                key={`FlatList-ProfileInput-${rowIndex.toString()}`}
                                listKey={`FlatList-ProfileInput-${rowIndex.toString()}`}
                                renderItem={({ item, index }) => (
                                    <View style={styles.EditProfileInput} key={`FlatList-ProfileInput-${rowIndex.toString()}-${index}`}>
                                        <Text style={styles.EditProfileInputTitle}>{item.title}</Text>
                                        <TextInput 
                                            style={styles.EditProfileInputField} 
                                            value={item.value as string} 
                                            keyboardType={`${item.title == "Age" ? "numeric" : "default"}`} 
                                            onChangeText={item.onChange} 
                                            placeholderTextColor="white"
                                        />
                                    </View>
                                )}
                                keyExtractor={(item, index) => `FlatList-ProfileInput-${rowIndex.toString()}-${index}`}
                            />
                        ))
                    }
                    <View style={styles.EditProfileBioView}>
                        <Text style={styles.EditProfileInputTitle}>Bio</Text>
                        <TextInput 
                            placeholder="bio" 
                            value={userData?.bio}
                            placeholderTextColor="white" 
                            style={styles.EditProfileInputBio} 
                            multiline 
                            onChangeText={
                                (text: string) => {
                                    setUserData({
                                        ...userData,
                                        bio: text
                                    });
                                }
                            } 
                        />
                    </View>
                </ScrollView>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    EditProfilePicture: {
        width: "100%",
        height: "25%",
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: "-3%",
        borderRadius: moderateScale(10),
        padding: moderateScale(10)
    },

    EditProfilePictureButton: {
        alignSelf: "flex-end",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: "#FF3636",
        position: "relative",
        top: verticalScale(-30)
    },

    EditProfileTitle: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
    },

    EditProfileButtons: {
        display: "flex",
        width: "100%",
        height: verticalScale(80)
    },

    EditProfileButton: {
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: "#FF3636",
        marginRight: moderateScale(2),
        width: scale(100),
        height: moderateScale(40)
    },

    EditProfileInputJoin: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginLeft: moderateScale(3)
    },

    EditProfileInput: {
        width: "50%",
    },

    EditProfileInputTitle: {
        fontSize: moderateScale(15),
        fontWeight: "bold",
        marginBottom: moderateScale(10),
        width: scale(200),
        color: "white"
    },

    EditProfileInputField: {
        width: scale(170),
        borderWidth: moderateScale(2),
        borderColor: "#222121",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginBottom: moderateScale(10),
        fontSize: moderateScale(15), 
        color: "white"
    },

    EditProfileBioView: {
        marginLeft: moderateScale(5)
    },

    EditProfileInputBio: {
        width: "97%",
        height: verticalScale(85),
        overflow: "scroll",
        borderWidth: moderateScale(2),
        borderColor: "#222121",
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginBottom: moderateScale(10),
        fontSize: moderateScale(15), 
        color: "white"
    }
});

export default Profile;
