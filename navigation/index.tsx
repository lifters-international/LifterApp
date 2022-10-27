import React, { useEffect } from "react";
import {
    NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";

import { Home, Profile, PasswordChange, FoodScreen, FoodAnalystics, Messages, MessageBox, Splash, Search, Login, SignUp, MessagesMatches } from "../screens";
import { View } from "react-native";
import { getFromStore, scale, verticalScale, moderateScale } from "../utils";
import { useAppDispatch } from "../redux";
import { VerifyToken, setToken, logIn, LoginAsyncThunkResult, setAppReady, setProfilePicture, setAuthState, getSignedInUser, GetSignedUserAsyncThunkResult } from "../redux/features/auth";
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { TabBar } from './Tab';

const Stack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const FoodStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
    return (
        <MessagesStack.Navigator>
            <MessagesStack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
            <MessagesStack.Screen name="MessagesMatches" component={MessagesMatches} options={{ headerShown: false }} />
            <MessagesStack.Screen name="MessageBox" component={MessageBox} options={{ headerShown: false }} />
        </MessagesStack.Navigator>
    );
}

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profiles" component={Profile} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Change Password" component={PasswordChange} options={{ headerShown: false }} />
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
    const { AppReady } = useSelector((state: any) => state.Auth);

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
                            icon: ({ focus }) => {
                                return (
                                    <View>
                                        <FontAwesome
                                            name="home"
                                            size={moderateScale(30)}
                                            color={focus ? "#FF3636" : "#5e5c5c"}
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
                        }
                    },
                    {
                        name: "Search",
                        component: <Search />,
                        options: {
                            label: "Search",
                            icon: ({ focus }) => {
                                return (
                                    <View>
                                        <Ionicons
                                            name="search"
                                            size={moderateScale(30)}
                                            color={focus ? "#FF3636" : "#5e5c5c"}
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
                        }
                    },
                    {
                        name: "Message",
                        component: <MessagesStackScreen />,
                        options: {
                            label: "Message",
                            icon: ({ focus }) => (
                                <View>
                                    <Ionicons
                                        name="mail"
                                        size={moderateScale(28)}
                                        color={focus ? "#FF3636" : "#5e5c5c"}
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
                        name: "FoodStack",
                        component: <FoodStackScreen />,
                        options: {
                            label: "FoodTab",
                            icon: ({ focus }) => (
                                <View>
                                    <Ionicons
                                        name="fast-food"
                                        size={moderateScale(28)}
                                        color={focus ? "#FF3636" : "#5e5c5c"}
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
                            icon: ({ focus }) => (
                                <View>
                                    <FontAwesome5
                                        name="dumbbell"
                                        size={moderateScale(30)}
                                        color={focus ? "#FF3636" : "#5e5c5c"}
                                        style={{
                                            width: scale(35),
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