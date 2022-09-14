import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

interface Props {
    children: JSX.Element | JSX.Element[];
    backgroundColor?: string;
}

const AppLayout: React.FC<Props> = ({ children, backgroundColor }) => {
    return (
        <View style={{...styles.container, backgroundColor: backgroundColor || "white" }}>
            <SafeAreaView>
                {children}
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

export default AppLayout;