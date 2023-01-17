import React, { useEffect } from "react";
import {
    NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";

import { Home, Heart, WatchTrainerVideo, BecomeClient, Profile, PasswordChange, DeleteAccount, FoodScreen, FoodCreate, FoodAnalystics, Messages, MessageBox, Splash, Search, Login, SignUp, MessagesMatches } from "../screens";
import { View, ImageBackground, Text, ActivityIndicator } from "react-native";
import { getFromStore, scale, verticalScale, moderateScale } from "../utils";
import { useAppDispatch } from "../redux";
import { VerifyToken, setToken, logIn, LoginAsyncThunkResult, setAppReady, setProfilePicture, setAuthState, getSignedInUser, GetSignedUserAsyncThunkResult } from "../redux/features/auth";
import { Ionicons, FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons';
import { TabBar } from './Tab';

import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const FoodStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const MessagesStack = createNativeStackNavigator();
const TrainersStack = createNativeStackNavigator();

const TestScreen = () => {
    return (
        <View>
            <Text>HELLO</Text>
        </View>
    )
}

const TrainersStackScreen = () => {
    return (
        <TrainersStack.Navigator>
            <TrainersStack.Screen name="Videos" component={TestScreen} options={{ headerShown: false }} />
        </TrainersStack.Navigator>
    )
}

const MessagesStackScreen = () => {
    return (
        <MessagesStack.Navigator>
            <MessagesStack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
            <MessagesStack.Screen name="MessagesMatches" component={MessagesMatches} options={{ headerShown: false }} />
            <MessagesStack.Screen name="MessageBox" component={MessageBox} options={{ headerShown: false }} />
        </MessagesStack.Navigator>
    );
}

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <HomeStack.Screen name="BecomeClient" component={BecomeClient} options={{ headerShown: false }} />
            <HomeStack.Screen name="Trainers" component={TrainersStackScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="Message" component={MessagesStackScreen} options={{ headerShown: false  }} />
            <HomeStack.Screen name="WatchVideo" component={WatchTrainerVideo} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    )
}

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profiles" component={Profile} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Change Password" component={PasswordChange} options={{ headerShown: false }} />
            <ProfileStack.Screen name="Delete Account" component={DeleteAccount} options={{ headerShown: false }} />
        </ProfileStack.Navigator>
    );
}

const FoodStackScreen = () => {
    return (
        <FoodStack.Navigator>
            <FoodStack.Screen name="Food" component={FoodScreen} options={{ headerShown: false }} />
            <FoodStack.Screen name="CreateFood" component={FoodCreate} options={{ headerShown: false }} />
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
                        component: <HomeStackScreen />,
                        options: {
                            label: "Trainers",
                            icon: ({ focus }) => (
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
                        name: "Heart",
                        component: <Heart />,
                        options: {
                            label: "Home",
                            icon: ({ focus }) => {
                                return (
                                    <View>
                                        <AntDesign
                                            name="heart"
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
                    }
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
        </Stack.Navigator>) : <LoadingScreen />
    )
}

function LoadingScreen() {
    return (
        <View>
            <ImageBackground source={require('../assets/icons/Icons/lifters-icon-google-play.png')} style={{ width: '100%', height: '100%' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF3636" />
                </View>
            </ImageBackground>
        </View>
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

            let tokenVerified = await dispatch(VerifyToken(token_saved || ""));

            if (tokenVerified.payload) {
                dispatch(setToken(token_saved!));
            } else if (username && password) {
                let logged = await dispatch(logIn({ username, password }));

                if ((logged.payload as LoginAsyncThunkResult).successfull) {
                    dispatch(setAuthState({
                        token: ((logged.payload as LoginAsyncThunkResult).data as string),
                        tokenVerified: true,
                        username,
                        password
                    }));
                }
            }

            dispatch(setAppReady(true))
        }
        setUp().then(() => { });
    }, []);

    return (
        <NavigationContainer>
            {
                AppReady ? (
                    tokenVerified ? (
                        <StripeProvider
                            publishableKey="pk_test_51LtTPwB5yAwp5CklgSjB8qC6v2jYZxgp6oTAa31tjutMjqiFQHWNyiEYpSGi2Bgl4LanXzyBECRvqA3poS60yHGv00eXzqq6t9"
                        >
                            <TabNavigator />
                        </StripeProvider>
                    ) : <AuthNavigationStack />
                ) : <LoadingScreen />
            }
        </NavigationContainer>
    )
}