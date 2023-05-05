import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { scale, verticalScale, moderateScale } from "../utils";

export type TabProps = {
    name: string;
    component: JSX.Element;
    options?: {
        label: string;
        icon: React.FC<{ focus: boolean }>;
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

export type TabScreenState = {
    tabVisible: boolean;
}

export type TabBarNonSharableState = {
    currentScreen: string;

    setCurrentScreen: (value: string) => void;

    tabScreensStates: {
        [key: string]: TabScreenState;
    };

    navProps: {
        [key: string]: any;
    };

    setNavProps: (key: string, value: any) => void;
}

export type TabBarSharableState = {
    getTabBarVisiblity: () => boolean;
    setTabBarVisiblity: (value: boolean) => void;
    navProps: { [key: string]: any };
    setScreenNavProps: (key: string, value: any) => void;
    navigate: ( to : string, props: { [ key: string ]: any } ) => void;
    resetNavProps: () => void;
}

export const TabBarContext = createContext<TabBarSharableState>({
    getTabBarVisiblity: () => true,
    navProps: {},
    setTabBarVisiblity: () => { },
    setScreenNavProps: () => { },
    navigate: () => { },
    resetNavProps: () => { }
});

const TabScreen: React.FC<TabScreen> = ({ name, component, tabBar, labeled }) => {
    const { getTabBarVisiblity } = useTabBarContext();

    return (
        <View style={styles.customTabScreen} >
            <Text>{name && labeled}</Text>
            {component}
            { getTabBarVisiblity() && tabBar}
        </View>
    )
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, initialTab, onChangeTab, barStyle, tabStyle, labeled }) => {
    const [currentScreen, setCurrentScreen] = useState<string>(initialTab);

    const [tabScreensStates, setTabScreensStates] = useState<{ [key: string]: TabScreenState }>(Object.assign(
        {},
        ...tabs.map(
            (tab) => {
                return {
                    [tab.name]: {
                        tabVisible: true,
                    }
                }
            }
        )
    ));

    const [navProps, setNavProps] = useState<{ [key: string]: any }>({});

    const setNavProp = (key: string, value: any) => {
        setNavProps(prev => (
            {
                ...prev,
                [key]: value
            }
        ))
    }

    const getTabBarVisiblity = () => {
        return tabScreensStates[currentScreen].tabVisible;
    }

    const setTabBarVisiblity = (value: boolean) => {
        setTabScreensStates(prev => {
            return {
                ...prev,
                [currentScreen]: {
                    ...prev[currentScreen],
                    tabVisible: value
                }
            }
        });
    }

    const setScreenNavProps = (key: string, value: any) => {
        setNavProp(key, value);
    }

    const resetNavProps = () => {
        setNavProps( prev => ({}) );
    }

    const navigate = (to: string, props?: { [key: string]: any }) => {
        setCurrentScreen(to);
        if (props) setNavProps(props);
    }

    return (
        <TabBarContext.Provider value={{ 
            getTabBarVisiblity, setTabBarVisiblity, navProps, setScreenNavProps, resetNavProps, navigate
        }}>
            <TabScreen
                name={currentScreen}
                labeled={labeled}
                component={ tabs.find(tab => tab.name === currentScreen)?.component! }
                tabBar={
                    <View style={[styles.customTabBar, barStyle]}>
                        {tabs.map((tab, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        navigate(tab.name);
                                    }}
                                    style={[styles.customTab, tabStyle]}
                                >
                                    {tab.options?.icon({ focus: tab.name === currentScreen })}
                                    <Text>{tab.options?.label && labeled}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                }
            />
        </TabBarContext.Provider>
    )
}

export const useTabBarContext = () => useContext(TabBarContext);

const styles = StyleSheet.create({
    customTabBar: {
        flexDirection: "row",
        backgroundColor: "#1d1c1c",
        padding: moderateScale(20),
        height: verticalScale(80),
        width: scale(340),
        borderRadius: moderateScale(25),
        alignItems: "center",
        position: "absolute",
        bottom: verticalScale(0),
        left: scale(5),
    },

    customTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },

    customTabScreen: {
        flex: 1,
        backgroundColor: "black"
    }
});
