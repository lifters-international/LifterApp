import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { FoodView, Loading, AppLayout } from "../components";

import { useGetFood, useSearchFood } from "../hooks";

import { useSelector } from "react-redux";

import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const Food: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const [search, setSearch] = useState('');
    const { foods, loading, error } = useGetFood();
    const { foods: searchFood, loading: searchLoading, error: searchError } = useSearchFood(search, token);

    if (loading || searchLoading) return <AppLayout backgroundColor="black"><Loading /></AppLayout>;

    if (error || searchError) return <AppLayout><Text>There was a problem loading the app. Please try again later.</Text></AppLayout>;

    return (
        <AppLayout backgroundColor="black">
            <View>
                <View style={styles.Headercontainer}>
                    <View style={styles.SearchBar}>
                        <Ionicons
                            name="search"
                            size={moderateScale(35)}
                            color="#5e5c5c"
                            style={{
                                width: scale(35),
                                height: verticalScale(35),
                                textDecorationColor: "black",
                                position: "relative",
                                top: verticalScale(3.5),
                            }}
                        />
                        <TextInput placeholder="Search Lifters Foods" style={styles.SearchInput} value={search} onChangeText={query => setSearch(query)} placeholderTextColor="#8f8d8d"/>

                    </View>

                    <AntDesign name="pluscircle" size={moderateScale(40)} color="white" style={styles.barChart} onPress={ () => navigation.navigate("CreateFood") } />
                    <MaterialIcons name="insert-chart-outlined" size={moderateScale(40)} color="white" style={styles.barChart} onPress={() => navigation.navigate("FoodAnalystics")} />
                </View>

                <ScrollView style={styles.FoodContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets = {true}
                    contentContainerStyle={{
                        justifyContent: 'space-between'
                    }}
                >
                    {
                        search.length > 0 ? (
                            searchFood.map((food) => (
                                <View key={`food-item-${food.id}`}>
                                    <FoodView {...food} />
                                </View>
                            ))
                        ) : (
                            foods.map((food) => (
                                <View key={`food-item-${food.id}`}>
                                    <FoodView {...food} />
                                </View>
                            ))
                        )
                    }

                    <View style={{ height: verticalScale(100) }}></View>
                </ScrollView>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({
    Headercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    SearchBar: {
        marginTop: moderateScale(5),
        width: "72%",
        height: verticalScale(48),
        display: "flex",
        flexDirection: "row",
        borderRadius: moderateScale(5),
        padding: moderateScale(2),
        borderBottomWidth: moderateScale(1),
        borderColor: "#5e5c5c",
    },

    SearchInput: {
        width: "100%",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        color: "#8f8d8d",
        fontSize: moderateScale(22),
    },

    barChart: {
        width: scale(50),
        transform: [{ rotateY: "180deg" }],
        height: verticalScale(50),
        position: "relative",
        top: verticalScale(10),
    },

    FoodContainer: {
        marginTop: moderateScale(10),
        width: "100%",
        height: verticalScale(600)
    }
});

export default Food;
