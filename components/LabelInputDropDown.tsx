import React, { useState } from "react";

import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';

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
            <Text style={styles.label}>{label}</Text>

            <View>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={text => {
                        if (typeof onTextChange === 'function') {
                            onTextChange(text);
                        }
                    }}
                />

                <DropDown
                    items={items}
                    onPress={item => {
                        if (typeof onSelectChange === 'function') {
                            onSelectChange(item);
                        }
                    }}
                />


            </View>
        </View>
    )


}

const styles = StyleSheet.create({

})

export default LabelInputDropDown;