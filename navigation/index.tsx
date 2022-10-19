import React, { useEffect } from "react";
import {
    NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { useSelector } from "react-redux";

import { Home, Profile, PasswordChange, FoodScreen, FoodAnalystics, Subscription, SubscriptionCheckOut, Messages, MessageBox, Splash, Search, Login, SignUp, MessagesMatches } from "../screens";
import { View, Image } from "react-native";
import Lottie from 'lottie-react-native';
import { getFromStore, returnImageSource, scale, verticalScale, moderateScale } from "../utils";
import { useAppDispatch } from "../redux";
import { VerifyToken, setToken, logIn, LoginAsyncThunkResult, setAppReady, setProfilePicture, setAuthState, getSignedInUser, GetSignedUserAsyncThunkResult } from "../redux/features/auth";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { TabBar } from './Tab';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const FoodStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
    return (
        <MessagesStack.Navigator>
            <MessagesStack.Screen name="Messages" component={Messages} />
            <MessagesStack.Screen name="MessagesMatches" component={MessagesMatches} options={{ headerShown: false }} />
            <MessagesStack.Screen name="MessageBox" component={MessageBox} options={{ headerShown: false }} />
        </MessagesStack.Navigator>
    );
}

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profiles" component={Profile} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Change Password" component={PasswordChange} />
            <ProfileStack.Screen name="Subscription" component={Subscription} />
            <ProfileStack.Screen name="Subscription CheckOut" component={SubscriptionCheckOut} options={{ headerShown: false }} />
        </ProfileStack.Navigator>
    );
}

const FoodStackScreen = () => {
    return (
        <FoodStack.Navigator>
            <FoodStack.Screen name="Food" component={FoodScreen} options={{ headerShown: false }} />
            <FoodStack.Screen name="FoodAnalystics" component={FoodAnalystics} options={{ headerShown: false }} />
        </FoodStack.Navigator>
    );
}

function TabNavigator() {
    const { profilePicture, AppReady } = useSelector((state: any) => state.Auth);
    const viewStyle = {
        
    }

    return (
        AppReady ? (
            <TabBar 
                initialTab="Home"
                tabs={[
                    {
                        name: "Home",
                        component: <Home />,
                        options: {
                            label: "Home",
                            icon: (
                                <View>
                                <FontAwesome 
                                    name="home" 
                                    size={moderateScale(30)} 
                                    color="red" 
                                    style={{
                                        width: scale(30),
                                        height: verticalScale(30),
                                        textDecorationColor: "black",
                                        position: "relative",
                                        top: moderateScale(2),
                                    }}
                                />
                            </View>
                            )
                                }
                    },
                    {
                        name: "Search",
                        component: <Search />,
                        options: {
                            label: "Search",
                            icon: (
                                <View>
                                <Ionicons
                                    name="search"
                                    size={moderateScale(30)}
                                    color="red"
                                    style={{
                                        width: scale(30),
                                        height: verticalScale(30),
                                        textDecorationColor: "black",
                                        position: "relative",
                                        top: moderateScale(2),
                                    }}
                                />
                            </View>
                            )
                        }
                    },
                    {
                        name: "Message",
                        component: <MessagesStackScreen />,
                        options: {
                            label: "Message",
                            icon: (
                                <View>
                                <Lottie
                                    loop
                                    autoPlay
                                    speed={1}
                                    source={require("../assets/messagingIcon.json")}
                                    style={{
                                        width: scale(30),
                                        height: verticalScale(30),
                                        position: "relative",
                                    }}
                                />
                            </View>
                            )
                        }
                    },
                    {
                        name: "FoodStack",
                        component: <FoodStackScreen />,
                        options: {
                            label: "FoodTab",
                            icon: (
                                <View>
                                <Ionicons 
                                    name="fast-food" 
                                    size={moderateScale(28)} 
                                    color="red" 
                                    style={{
                                        width: scale(30),
                                        height: verticalScale(30),
                                        textDecorationColor: "black",
                                        position: "relative",
                                        top: moderateScale(2),
                                    }}
                                />
                            </View>
                            )
                        }
                    },
                    {
                        name: "Profile",
                        component: <ProfileStackScreen />,
                        options: {
                            label: "Profile",
                            icon: (
                                <View>
                                <Image
                                    source={
                                        returnImageSource(profilePicture, { width: scale(40), height: verticalScale(40), borderRadius: moderateScale(30), borderWidth: moderateScale(2) })
                                    }
                                    style={{
                                        padding: moderateScale(4),
                                        borderRadius: moderateScale(30),
                                        borderWidth: moderateScale(2),
                                        borderColor: "red",
                                        width: scale(40),
                                        height: verticalScale(40),
                                        position: "relative",
                                        top: moderateScale(7),
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            )
                        }
                    },
                ]}
                
            />
        ) : null
    );
}

function AuthNavigationStack() {
    const { AppReady } = useSelector((state: any) => state.Auth);
    return (
        AppReady ? (<Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        </Stack.Navigator>) : null
    )
}

export default function Navigation() {
    const dispatch = useAppDispatch();

    const { tokenVerified, AppReady } = useSelector((state: any) => state.Auth);


    useEffect(() => {
        const setUp = async () => {
            let token_saved = await getFromStore("token");
            let username = await getFromStore("username");
            let password = await getFromStore("password");

            const profPicSetUp = async (token: string) => {
                if (token) {
                    let resp = await dispatch(getSignedInUser(token));
                    let payload = resp.payload as GetSignedUserAsyncThunkResult;

                    if (payload.data && payload.getUserDataSuccess) {
                        if (payload.data.profilePicture !== "/defaultPicture.png") {
                            dispatch(setProfilePicture(payload.data.profilePicture));
                        }
                    }
                }

                dispatch(setAppReady(true));
            }

            let tokenVerified = await dispatch(VerifyToken(token_saved || ""));

            if (tokenVerified.payload) {
                dispatch(setToken(token_saved!));
                await profPicSetUp(token_saved!);
            } else if (username && password) {
                let logged = await dispatch(logIn({ username, password }));

                if ((logged.payload as LoginAsyncThunkResult).successfull) {
                    dispatch(setAuthState({
                        token: ((logged.payload as LoginAsyncThunkResult).data as string),
                        tokenVerified: true,
                        username,
                        password
                    }));
                    await profPicSetUp(((logged.payload as LoginAsyncThunkResult).data as string));
                }
            }
        }
        setUp().then(() => { });
    }, []);

    return (
        <NavigationContainer>
            {
                AppReady ? (
                    tokenVerified ? <TabNavigator /> : <AuthNavigationStack />
                ) : null
            }
        </NavigationContainer>
    )
}