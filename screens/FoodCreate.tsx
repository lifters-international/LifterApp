import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { FoodView, Loading, AppLayout } from "../components";

import { useGetFood, useSearchFood } from "../hooks";

import { useSelector } from "react-redux";

import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale, NutritionUnits, NutritionFactsJson, NutritionFacts, fetchGraphQl } from "../utils";

import { UserCreateFood } from "../graphQlQuieries";

import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
    navigation: NavigationProp<any>;
}

const FoodCreate : React.FC<Props> = ({ navigation }) => {
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

    return ( 
        <AppLayout backgroundColor="black">
            <View>
                <Text>Create Food</Text>

                <View>
                    <TextInput 
                        placeholder="Name Of Food"
                        value={name}
                        onChangeText={setName}
                    />

                    <View>
                        <TextInput
                            placeholder="Food Serving Size"
                            value={foodServing.measurment.toString()}
                            onChangeText={text => setFoodServing({
                                ...foodServing,
                                measurment: Number(text)
                            })}
                        />

                        <DropDownPicker
                            open={true}
                            setOpen={() => {}}
                            items={units.map(unit => ({
                                label: unit,
                                value: unit
                            }))}
                            containerStyle={{height: 40}}
                            style={{backgroundColor: '#fafafa'}}
                            value={foodServing.unit}
                            setValue={setFoodServing}
                        />

                    </View>
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({

})

export default FoodCreate;
