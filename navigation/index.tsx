import React, { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { createMaterialBottomTabNavigator } from
    "react-navigation-material-bottom-tabs";

import TaskBar from "./TaskBar";
import { useDispatch } from "react-redux";

import { Home, Profile, Messages, Splash } from "../screens";

type AuthNavigatorList = {
    Splash: null;
    Login: null;
    Register: null;
}

type TabInfor = {
    focused: boolean;
    horizontal: boolean;
    tintColor: string;
}

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: (tabInfo : TabInfor) => {
                <Ionicons 
                    name="md-home"
                    size={tabInfo.focused ? 26 : 20}
                />
            }
        }
    }
});

function TaskBarNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            tabBar={ props => <TaskBar {...props} /> }
        >
            <Tab.Screen name="Home" component={Home} key="Home"/>
            <Tab.Screen name="Message" component={Messages} key="Message"/>
            <Tab.Screen name="Profile" component={Profile} key="Profile"/>
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