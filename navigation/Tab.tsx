import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { scale, verticalScale, moderateScale } from "../utils";

export type TabProps = {
    name: string;
    component: JSX.Element;
    options?: {
        label: string;
        icon: JSX.Element;
    }
}

export type TabBarProps = {
    tabs: TabProps[];
    initialTab: string;
    onChangeTab?: (tab: TabProps) => void;
    barStyle?: StyleProp<ViewStyle>;
    tabStyle?: StyleProp<ViewStyle>;
    labeled?: boolean;
}

export type TabScreen = {
    name: string;
    component: JSX.Element;
    tabBar: JSX.Element;
    labeled?: boolean;
}

const TabScreen: React.FC<TabScreen> = ({ name, component, tabBar, labeled }) => {
    return (
        <View style={styles.customTabScreen} >
            <Text>{ name && labeled }</Text>
            {component}
            {tabBar}
        </View>
    )
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, initialTab, onChangeTab, barStyle, tabStyle, labeled }) => {
    const [currentScreen, setCurrentScreen] = useState(initialTab);

    return (
        <TabScreen
            name={currentScreen}
            labeled={labeled}
            component={tabs.find(tab => tab.name === currentScreen)?.component!}
            tabBar={
                <View style={[styles.customTabBar, barStyle]}>
                    {tabs.map((tab, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentScreen(tab.name);
                                    if (onChangeTab) onChangeTab(tab);
                                }}
                                style={[styles.customTab, tabStyle]}
                            >
                                {tab.options?.icon}
                                <Text>{tab.options?.label && labeled}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    customTabBar: {
        flexDirection: "row",
        backgroundColor: "white", 
        padding: moderateScale(10),
        height: verticalScale(60),
        width: scale(359),
        borderWidth: 1,
        borderColor: "gainsboro",
        alignItems: "center",
        position: "absolute",
        bottom: verticalScale(0)
    },

    customTab: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: "center"
    },

    customTabScreen: {
        flex: 1
    }
});