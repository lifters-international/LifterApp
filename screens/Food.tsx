import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { FoodView, Loading, AppLayout } from "../components";

import { useGetFood, useSearchFood } from "../hooks";

import { useSelector } from "react-redux";

import { AntDesign } from '@expo/vector-icons';

import { scale, moderateScale } from "../utils";

interface Props {
    navigation: NavigationProp<any>;
}

const Food: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const [search, setSearch] = useState('');
    const { foods, loading, error } = useGetFood();
    const { foods: searchFood, loading: searchLoading, error: searchError } = useSearchFood(search, token);

    if ( loading || searchLoading ) return <AppLayout><Loading /></AppLayout>;

    if ( error || searchError ) return <AppLayout><Text>There was a problem loading the app. Please try again later.</Text></AppLayout>;

    return (
        <AppLayout>
            <View>
                <View style={styles.Headercontainer}>
                    <View style={styles.SearchBar}>
                        <TextInput placeholder="Search Lifters Foods" style={styles.SearchInput} value={search} onChangeText={query => setSearch(query)} />
                    </View>
                    <AntDesign name="barschart" size={40} color="black" style={styles.barChart} onPress={() => navigation.navigate("FoodAnalystics")}/>
                </View>

                <ScrollView style={styles.FoodContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        search.length > 0 ? (
                            searchFood.map(( food ) => (
                                <View key={`food-item-${food.id}`}>
                                    <FoodView {...food}  />
                                </View>
                            ))
                        ) : (
                            foods.map(( food ) => (
                                <View key={`food-item-${food.id}`}>
                                    <FoodView {...food}  />
                                </View>
                            ))
                        )
                    }
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
        width: "85%",
        display: "flex",
        flexDirection: "row",
        borderRadius: moderateScale(5),
        padding: moderateScale(2)
    },

    SearchInput: {
        width: "100%",
        borderWidth: moderateScale(2),
        borderColor: "black",
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        color: "black"
    },

    barChart: {
        width: scale(50)
    },

    FoodContainer: {
        marginTop: moderateScale(10),
        marginBottom: "-30%",
        width: "100%",
        height: "100%"
    }
});

export default Food;
