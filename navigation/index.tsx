import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { useSelector } from "react-redux";

import { Home, Profile, Messages, Splash, Login, SignUp } from "../screens";
import { View, Image } from "react-native";
import Lottie from 'lottie-react-native';
import { getFromStore } from "../utils";
import { useAppDispatch } from "../redux";
import { VerifyToken, setToken, logIn, LoginAsyncThunkResult, setAuthState, getSignedInUser, GetSignedUserAsyncThunkResult } from "../redux/features/auth"; 

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function TabNavigator() {
    const dispatch = useAppDispatch();
    const { token } = useSelector((state: any) => state.Auth);
    const [ uri, setUri ] = useState("../assets/defaultPicture.png");

    useEffect(() => {   
        const profPicSetUp = async () => {
            if(token) {
                let resp = await dispatch( getSignedInUser(token) );
                let payload = resp.payload as GetSignedUserAsyncThunkResult;

                if (payload.data && payload.getUserDataSuccess) {
                    if (payload.data.profilePicture !== "/defaultPicture.png") {
                        setUri(payload.data.profilePicture);
                    }
                }
            }
        }

        profPicSetUp().then();
    }, []);

    return (
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
                name="Messages" 
                component={Messages} 
                options={{
                    tabBarLabel: "Messages",
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
                component={Profile} 
                options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: () => (
                        <View>
                            <Image 
                                source={ 
                                    uri === "../assets/defaultPicture.png" ? require("../assets/defaultPicture.png") : { uri, width: 40, height: 40, borderRadius: 30} 
                                } 
                                style={{
                                    padding: 5,
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: "red",
                                    width: 40,
                                    height: 40
                                }}
                            />
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    );
}

function AuthNavigationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown : false }} >
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default function Navigation() {
    const dispatch = useAppDispatch();

    const { tokenVerified } = useSelector((state: any) => state.Auth);

    useEffect(() => {
        const setUp = async () => {
            let token = await getFromStore("token");
            let username = await getFromStore("username");
            let password = await getFromStore("password");

            let tokenVerified = await dispatch( VerifyToken(token || "") );
            
            if (tokenVerified.payload) {
                dispatch( setToken(token!) );
            }else if (username && password) {
                let logged = await dispatch( logIn({ username, password }) );

                if (( logged.payload as LoginAsyncThunkResult).successfull) {
                    dispatch( setAuthState({
                        token: ( (logged.payload as LoginAsyncThunkResult).data as string),
                        tokenVerified: true,
                        username, 
                        password
                    }) );
                }
            }

        }
        setUp().then(() => {});
    }, []);

    return (
        <NavigationContainer>
            { tokenVerified ? <TabNavigator /> : <AuthNavigationStack /> }
        </NavigationContainer>
    )
}