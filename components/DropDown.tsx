import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { moderateScale } from "../utils";

export type ValueType = string | number;

export type DropDownProps = {
    items: ValueType[],
    onPress?: (item: ValueType) => void,
}

export type DropDownState<T> = {
    selected: T;
    open: boolean;
}

const DropDown: React.FC<DropDownProps> = ({ items, onPress }) => {
    const [state, setState] = useState<DropDownState<ValueType>>({
        selected: items[0],
        open: false,
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.selectedContainer}
                onPress={
                    () => setState({
                        ...state,
                        open: !state.open
                    })
                }
            >
                <Text style={styles.selectedText}>{state.selected}</Text>
                <Entypo name="arrow-bold-down" size={moderateScale(24)} color="#5e5c5c" />
            </TouchableOpacity>

            {
                state.open && (
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: "center" }}>
                        {
                            items.map((item, index) => (
                                state.selected !== item && 
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setState({
                                            ...state,
                                            selected: item,
                                            open: false,
                                        })

                                        if (typeof onPress === 'function') {
                                            onPress(item);
                                        }

                                    }}
                                    style={styles.dropDownContent}
                                >
                                    <Text style={styles.dropDownText}>{item}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                )
            }
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#5e5c5c",
        borderRadius: moderateScale(20)
    },

    selectedContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    selectedText: {
        color: "#5e5c5c",
        textAlign: "center",
        fontSize: moderateScale(18),
        fontWeight: "bold",
        width: "93%"
    },

    scrollView: {
        flex: 1,
        flexDirection: "column"
    },

    dropDownContent: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#5e5c5c",
        marginBottom: moderateScale(2)
    },

    dropDownText: {
        color: "#5e5c5c",
        textAlign: "center",
        fontSize: moderateScale(18),
        fontWeight: "bold"
    }
})

export default DropDown;
