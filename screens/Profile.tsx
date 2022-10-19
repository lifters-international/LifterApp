import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground, FlatList } from 'react-native';
import { AppLayout, Button, Loading } from "../components";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { saveToStore, userInformationToSave, getImageUploadApi, returnImageSource, getServerUrl } from "../utils";
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

        if (jsonRes.imageURL) {
            await saveUserData.saveAsync({
                token,
                userInfor: {
                    profilePicture: jsonRes.imageURL
                }
            });

        }

        setLoading(false);
    }

    if ( loading ) return <AppLayout><Loading /></AppLayout>;

    return (
        <AppLayout>
            <View>
                <View style={styles.EditProfilePicture}>
                    <ImageBackground source={returnImageSource(profilePicture)} style={{ flex: 1, justifyContent: "center" }}>
                        <Button title="Upload New Profile Picture" style={styles.EditProfilePictureButton} textStyle={{ color: "white", fontSize: 10 }} onPress={pickImage} />
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
                                title: "Subscription",
                                onClick: () => {
                                    navigation.navigate("Subscription");
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
                            }
                        ]}
                        renderItem={({ item }) => (
                            <Button title={item.title} style={styles.EditProfileButton} textStyle={{ color: "white", fontSize: 10, textAlign: "center" }} onPress={item.onClick} />
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
                                            age: parseInt(text)
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
                                        <TextInput style={styles.EditProfileInputField} value={item.value as string} keyboardType={`${item.title == "Age" ? "numeric" : "default"}`} onChangeText={item.onChange} />
                                    </View>
                                )}
                                keyExtractor={(item, index) => `FlatList-ProfileInput-${rowIndex.toString()}-${index}`}
                            />
                        ))
                    }
                    <View style={styles.EditProfileBioView}>
                        <Text style={styles.EditProfileInputTitle}>Bio</Text>
                        <TextInput placeholder="bio" style={styles.EditProfileInputBio} multiline onChangeText={
                            (text: string) => {
                                setUserData({
                                    ...userData,
                                    bio: text
                                });
                            }
                        } />
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
        borderWidth: 1,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10
    },

    EditProfilePictureButton: {
        alignSelf: "flex-end",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "red",
        position: "relative",
        top: -30
    },

    EditProfileTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },

    EditProfileButtons: {
        display: "flex",
        width: "100%",
        height: 80,
    },

    EditProfileButton: {
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "red",
        marginRight: 1,
        width: 94,
        height: "50%",
    },

    EditProfileInputJoin: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginLeft: 5
    },

    EditProfileInput: {
        width: "50%"
    },

    EditProfileInputTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 10,
        width: 200
    },

    EditProfileInputField: {
        width: 180,
        borderWidth: 2,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 10
    },

    EditProfileBioView: {
        marginLeft: 5
    },

    EditProfileInputBio: {
        width: "97%",
        height: 85,
        overflow: "scroll",
        borderWidth: 2,
        borderColor: "gainsboro",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    }
});

export default Profile;
