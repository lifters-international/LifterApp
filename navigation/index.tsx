import React, { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ColorSchemeName, Pressable } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TaskBar from "./TaskBar";
import { useDispatch } from "react-redux";

import { Home, Profile, Messages, Splash } from "../screens";

type AuthNavigatorList = {
    Splash: null;
    Login: null;
    Register: null;
}

type TaskBarNavigatorList = {
    Profile: null;
    Message: null;
    Home: null;
}

const Stack = createNativeStackNavigator<AuthNavigatorList>();
const Tab = createBottomTabNavigator<TaskBarNavigatorList>();

function TaskBarNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: "#ffffff",
                    borderRadius: 15,
                    height: 90
                }
            }}
            tabBar={ props => <TaskBar {...props} /> }
        >
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Message" component={Messages} />
            <Tab.Screen name="Home" component={Home} />
        </Tab.Navigator>
    )
}

function AuthNavigationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown : false}} >
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default function Navigation() {
    return (
        <NavigationContainer>
            {/*<AuthNavigationStack /> */}
            <TaskBarNavigation />
        </NavigationContainer>
    )
}