import React from "react";

import { Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

export default Button;