import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, SafeAreaView, FlatList } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { Loading, AppLayout, LabelInputDropdown } from "../components";

import { Feather } from '@expo/vector-icons';

import { useSelector } from "react-redux";

import { scale, moderateScale, verticalScale, NutritionUnits, NutritionFactsJson, NutritionFacts, fetchGraphQl } from "../utils";

import { UserCreateFood } from "../graphQlQuieries";

interface Props {
    navigation: NavigationProp<any>;
}

const styles = StyleSheet.create({
    Header: {
        padding: moderateScale(8)
    },

    HeaderText: {
        fontSize: moderateScale(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        position: "relative",
        top: moderateScale(30)
    },

    line: {
        height: verticalScale(50),
        width: scale(400),
        zIndex: 1
    },

    inputDropsContainer: {
        flexDirection: "column"
    },

    inputDropsLabel: {
        color: "#5e5c5c",
        fontSize: moderateScale(20),
    },

    inputDrops: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#5e5c5c",
    },

    inputForDrops: {
        width: scale(150),
        height: verticalScale(40),
        color: "#5e5c5c"

    },

    button: {
        width: scale(300),
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#FF3636",
        display: "flex",
        flexDirection: "row"
    }
})

const FoodCreate: React.FC<Props> = ({ navigation }) => {
    const { token } = useSelector((state: any) => state.Auth);
    const units = Object.values(NutritionUnits).filter(unit => isNaN(Number(unit)));
    const [name, setName] = useState("");

    const [foodServing, setFoodServing] = useState<NutritionFactsJson>({
        measurment: 0,
        unit: units[0] as NutritionUnits,
    });

    const [loading, setLoading] = useState(false);

    const [calories, setCalories] = useState(0);

    const [nutriftionFacts, setNutriftionFacts] = useState<NutritionFacts>({
        totalFat: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        saturatedFat: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        transFat: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        cholesterol: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        sodium: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        totalCarbohydrate: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        dietaryFiber: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        totalSugars: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        addedSugars: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        protein: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        vitaminD: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        calcium: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        iron: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        },

        potassium: {
            measurment: 0,
            unit: units[0] as NutritionUnits,
        }
    });

    const handleSubmit = async () => {
        if (
            name.length <= 0 ||
            foodServing.measurment <= 0
        ) return alert("Please fill in all fields");

        setLoading(true);
        const response = await fetchGraphQl(UserCreateFood, {
            foodInput: {
                name,
                servingSize: foodServing,
                calories,
                nutritionFacts: nutriftionFacts
            },
            token
        });
        setLoading(false);

        if (response.errors) return alert(response.errors[0].message);

        else {
            alert("Food created successfully");
            navigation.navigate("Food")
        }
    }

    if ( loading ) return <AppLayout backgroundColor="black"><Loading /></AppLayout>

    return (
        <AppLayout backgroundColor="black">
            <SafeAreaView>
                <View style={styles.Header}>
                    <Text style={styles.HeaderText}>CREATE NEW FOOD</Text>
                    <Image
                        source={require("../assets/images/hero-section-line-vector.png")}
                        style={styles.line}
                        resizeMode="contain"
                    />
                </View>

                <View>
                    <View style={styles.inputDrops}>
                        <Text style={styles.inputDropsLabel}>Name of food:</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={{
                                ...styles.inputForDrops,
                                flex: 0.96
                            }}
                        />
                    </View>

                    <View style={styles.inputDrops}>
                        <Text style={styles.inputDropsLabel}>Calories:</Text>
                        <TextInput
                            placeholder='Calories'
                            keyboardType='numeric'
                            placeholderTextColor="#5e5c5c"
                            value={calories.toString()}
                            onChangeText={(text) => setCalories(Number(text))}
                            style={{
                                ...styles.inputForDrops,
                                flex: 0.96
                            }}
                        />
                    </View>

                    <LabelInputDropdown
                        label="Food Serving Size"
                        value={foodServing.measurment.toString()}
                        onTextChange={text => setFoodServing({
                            ...foodServing,
                            measurment: Number(text)
                        })}
                        onSelectChange={
                            value => setFoodServing({
                                ...foodServing,
                                unit: value as NutritionUnits
                            })
                        }
                        items={units.map(unit => (unit))}
                    />

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderColor: "#5e5c5c",
                        }}
                    >
                        <Text
                            style={{
                                color: "#5e5c5c",
                                fontSize: moderateScale(20),
                                marginTop: verticalScale(10),
                                marginBottom: verticalScale(18),
                                textAlign: "center"
                            }}
                        >Nutrition Facts</Text>
                    </View>

                    <FlatList style={{ height: verticalScale(220) }}
                        data={Object.keys(nutriftionFacts)}
                        renderItem={({ item }) => {
                            const nutritionFact = nutriftionFacts[item as keyof NutritionFacts];
                            return (
                                <LabelInputDropdown
                                    label={item}
                                    value={nutritionFact.measurment.toString()}
                                    onTextChange={text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        [item]: {
                                            ...nutritionFact,
                                            measurment: Number(text)
                                        }
                                    })}

                                    onSelectChange={
                                        value => setNutriftionFacts({
                                            ...nutriftionFacts,
                                            [item]: {
                                                ...nutritionFact,
                                                unit: value as NutritionUnits
                                            }
                                        })
                                    }
                                    items={units.map(unit => (unit))}

                                />
                            )
                        }}
                    />

                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            right: scale(-35),
                            width: scale(280),
                            zIndex: 1,
                        }}
                    >
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={{ color: "white", fontSize: moderateScale(30) }}>CREATE FOOD</Text>
                            <Feather name="arrow-up-right" size={moderateScale(40)} color="white" style={{ position: "absolute", left: scale(260), top: verticalScale(6) }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </AppLayout>
    )
}

export default FoodCreate;
