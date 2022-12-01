import React, { useState } from "react";

import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { moderateScale, verticalScale } from "../utils";

import DropDown from "./DropDown";

export type Props = {
    label: string,
    items: any[],
    onTextChange?: (text: string) => void,
    onSelectChange?: (item: any) => void,
    value: string
}

const LabelInputDropDown: React.FC<Props> = ({ label, value, items, onTextChange, onSelectChange }) => {
    return (
        <View>
            <Text style={styles.label}>{label}:</Text>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                }}
            >
                <TextInput
                    style={{ flex:1, fontSize: moderateScale(16), color: "#5e5c5c" }}
                    value={value}
                    onChangeText={onTextChange}
                />

                <DropDown
                    items={items}
                    onPress={onSelectChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: moderateScale(16),
        fontWeight: "bold",
        color: "#5e5c5c",
        marginTop: verticalScale(8),
    },

    input: {
        height: verticalScale(40),
        borderColor: "#5e5c5c",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginTop: verticalScale(8),
    }
})

export default LabelInputDropDown;