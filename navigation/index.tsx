import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { useSelector } from "react-redux";

import { Home, Profile, PasswordChange, Messages, MessageBox, Splash, Search, Login, SignUp, MessagesMatches } from "../screens";
import { View, Image } from "react-native";
import Lottie from 'lottie-react-native';
import { getFromStore, returnImageSource } from "../utils";
import { useAppDispatch } from "../redux";
import { VerifyToken, setToken, logIn, LoginAsyncThunkResult, setAppReady, setProfilePicture, setAuthState, getSignedInUser, GetSignedUserAsyncThunkResult } from "../redux/features/auth"; 
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
    return (
        <MessagesStack.Navigator>
            <MessagesStack.Screen name="Messages" component={Messages} />
            <MessagesStack.Screen name="MessagesMatches" component={MessagesMatches} options={{ headerShown: false }}/>
            <MessagesStack.Screen name="MessageBox" component={MessageBox} options={{ headerShown: false }}/>
        </MessagesStack.Navigator>
    );
}

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="Profiles" component={Profile} options={{ headerShown: false }}/>
            <ProfileStack.Screen name="Change Password" component={PasswordChange} />
        </ProfileStack.Navigator>
    );
}

function TabNavigator() {
    const { profilePicture, AppReady } = useSelector((state: any) => state.Auth);

    return (
        AppReady ? (
            <Tab.Navigator 
            initialRouteName="Home"
            activeColor="#f0edf6"
            inactiveColor="#000000"
            barStyle={{ backgroundColor: "white" }}
            labeled={false}
        >
            <Tab.Screen 
                name="Home" 
                component={Home} 
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: () => (
                        <View>
                            <Lottie
                                loop
                                autoPlay
                                speed={1}
                                source={require("../assets/homeIcon.json")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }}
                            />
                        </View>
                    )
                }}
            />

            <Tab.Screen 
                name="Search"
                component={Search}
                options={{
                    tabBarLabel: "Search",
                    tabBarIcon: () => (
                        <View>
                            <Ionicons 
                                name="search" 
                                size={30} 
                                color="red" 
                                style={{
                                    width: 30,
                                    height: 30,
                                    textDecorationColor: "black",
                                }}
                            />
                        </View>
                    )
                }}
            />
             
            <Tab.Screen 
                name="Message" 
                component={MessagesStackScreen} 
                options={{
                    tabBarLabel: "Message",
                    tabBarIcon: () => (
                        <View>
                            <Lottie
                                loop
                                autoPlay
                                speed={1}
                                source={require("../assets/messagingIcon.json")}
                                style={{
                                    width: 30,
                                    height: 30,
                                }}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileStackScreen} 
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: () => (
                        <View>
                            <Image 
                                source={ 
                                    returnImageSource(profilePicture, { width: 40, height: 40, borderRadius: 30 })
                                } 
                                style={{
                                    padding: 5,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: "red",
                                    width: 40,
                                    height: 40
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
        ) : null
    );
}

function AuthNavigationStack() {
    const { AppReady } = useSelector((state: any) => state.Auth);
    return (
        AppReady ? (<Stack.Navigator screenOptions={{ headerShown : false }} >
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

            const profPicSetUp = async (token : string) => {
                if (token) {
                    let resp = await dispatch( getSignedInUser(token) );
                    let payload = resp.payload as GetSignedUserAsyncThunkResult; 

                    if (payload.data && payload.getUserDataSuccess) {
                        if (payload.data.profilePicture !== "/defaultPicture.png") {
                            dispatch( setProfilePicture(payload.data.profilePicture) );
                        }
                    }
                }

                dispatch( setAppReady(true) );
            }

            let tokenVerified = await dispatch( VerifyToken(token_saved || "") );
            
            if (tokenVerified.payload) {
                dispatch( setToken(token_saved!) );
                await profPicSetUp(token_saved!);
            }else if (username && password) {
                let logged = await dispatch( logIn({ username, password }) );

                if (( logged.payload as LoginAsyncThunkResult).successfull) {
                    dispatch( setAuthState({
                        token: ( (logged.payload as LoginAsyncThunkResult).data as string),
                        tokenVerified: true,
                        username, 
                        password
                    }) );
                    await profPicSetUp( ( (logged.payload as LoginAsyncThunkResult).data as string) );
                }
            }
        }
        setUp().then(() => {});
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