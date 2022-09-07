import { View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from 'lottie-react-native';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function TaskBar({ state, descriptors, navigation } : BottomTabBarProps) {
    return (
        <View 
            style={{
                flexDirection: "row",
                width: "100%",
                height: 100,
                marginBottom: 0,
                justifyContent: "space-evenly"
            }}
        >
            {
                state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const label = 
                        options.tabBarLabel !== undefined
                        ? 
                        options.tabBarLabel
                        : options.title !== undefined
                            ? 
                            options.title
                            : route.name;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    }

                    const dimensions = {
                        width: 0, 
                        height: 0
                    }

                    let logo: string;

                    switch (label) {
                        case "Home":
                            logo = require("../assets/LiftersLogo.png");
                            dimensions.height = 35;
                            dimensions.width = 30;
                            break;

                        default: 
                            logo = "";
                            return <></>
                    }

                    return (
                        <TouchableOpacity
                            key={label}
                            accessibilityRole="button"
                            style={{ marginTop: 15 }}
                            onPress={onPress}
                        >
                            <LottieView 
                                source={logo}
                                autoPlay
                                loop
                                style={{ ...dimensions }}
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}