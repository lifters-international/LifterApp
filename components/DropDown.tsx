import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { moderateScale, verticalScale } from "../utils";

export type ValueType = string | number;

export type DropDownProps = {
    items: ValueType[],
    onPress?: (item: ValueType) => void
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
        <View style={{ ...styles.container }} >
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

            <FlatList
                data={items}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.dropDownContent}
                        onPress={() => {
                            setState({
                                ...state,
                                selected: item,
                                open: false
                            });
                            
                            if (typeof onPress === 'function') {
                                onPress(item);
                            }
                        }}
                    >
                        <Text style={styles.dropDownText}>{item}</Text>
                    </TouchableOpacity>
                )}

                keyExtractor={(item, index) => index.toString()}

                style={{
                    display: state.open ? "flex" : "none"
                }}
                    
            />

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
        width: "50%"
    },

    scrollView: {
        flex: 1,
        position: "relative",
        top: verticalScale(10),
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "#5e5c5c",
    },

    dropDownContent: {
        borderBottomWidth: 1,
        borderColor: "#5e5c5c",
        backgroundColor: "black"
    },

    dropDownText: {
        color: "#5e5c5c",
        textAlign: "center",
        fontSize: moderateScale(20),
        fontWeight: "bold"
    }
})

export default DropDown;
