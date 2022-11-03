import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { FoodView, Loading, AppLayout, DropDown } from "../components";

import { useGetFood, useSearchFood } from "../hooks";

import { useSelector } from "react-redux";

import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

import { scale, moderateScale, verticalScale, NutritionUnits, NutritionFactsJson, NutritionFacts, fetchGraphQl } from "../utils";

import { UserCreateFood } from "../graphQlQuieries";

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
                            keyboardType='numeric'
                            value={foodServing.measurment.toString()}
                            onChangeText={text => setFoodServing({
                                ...foodServing,
                                measurment: Number(text)
                            })}
                        />

                        <DropDown
                            items={units.map( unit => (unit) )}

                            onPress={
                                value => {
                                    setFoodServing({
                                        ...foodServing,
                                        unit: value as NutritionUnits
                                    })
                                }
                            }
                        />

                    </View>

                    <TextInput
                        placeholder='Calories'
                        value={calories.toString()}
                        onChangeText={(text) => setCalories(Number(text) ) }
                    />

                    <Text>Nutrition Facts</Text>

                    <ScrollView>
                    <View>
                            <TextInput
                                placeholder="Total Fats"
                                value={nutriftionFacts.totalFat.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalFat: {
                                            ...nutriftionFacts.totalFat,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) ) }

                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalFat: {
                                            ...nutriftionFacts.totalFat,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>


                        <View>
                            <TextInput
                                placeholder="Saturated Fats"
                                value={nutriftionFacts.saturatedFat.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        saturatedFat: {
                                            ...nutriftionFacts.saturatedFat,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}

                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        saturatedFat: {
                                            ...nutriftionFacts.saturatedFat,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Trans Fats"
                                value={nutriftionFacts.transFat.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        transFat: {
                                            ...nutriftionFacts.transFat,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        transFat: {
                                            ...nutriftionFacts.transFat,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Cholesterol"
                                value={nutriftionFacts.cholesterol.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        cholesterol: {
                                            ...nutriftionFacts.cholesterol,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        cholesterol: {
                                            ...nutriftionFacts.cholesterol,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Sodium"
                                value={nutriftionFacts.sodium.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        sodium: {
                                            ...nutriftionFacts.sodium,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        sodium: {
                                            ...nutriftionFacts.sodium,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Total Carbohydrate"
                                value={nutriftionFacts.totalCarbohydrate.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalCarbohydrate: {
                                            ...nutriftionFacts.totalCarbohydrate,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalCarbohydrate: {
                                            ...nutriftionFacts.totalCarbohydrate,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Dietary Fiber"
                                value={nutriftionFacts.dietaryFiber.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        dietaryFiber: {
                                            ...nutriftionFacts.dietaryFiber,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        dietaryFiber: {
                                            ...nutriftionFacts.dietaryFiber,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Total Fats"
                                value={nutriftionFacts.addedSugars.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        addedSugars: {
                                            ...nutriftionFacts.addedSugars,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        addedSugars: {
                                            ...nutriftionFacts.addedSugars,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Total Sugars"
                                value={nutriftionFacts.totalSugars.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalSugars: {
                                            ...nutriftionFacts.totalSugars,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        totalSugars: {
                                            ...nutriftionFacts.totalSugars,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Vitamin D"
                                value={nutriftionFacts.vitaminD.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        vitaminD: {
                                            ...nutriftionFacts.vitaminD,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        vitaminD: {
                                            ...nutriftionFacts.vitaminD,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Iron"
                                value={nutriftionFacts.iron.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        iron: {
                                            ...nutriftionFacts.iron,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        iron: {
                                            ...nutriftionFacts.iron,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Calcium"
                                value={nutriftionFacts.calcium.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        calcium: {
                                            ...nutriftionFacts.calcium,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        calcium: {
                                            ...nutriftionFacts.calcium,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Potassium"
                                value={nutriftionFacts.potassium.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        potassium: {
                                            ...nutriftionFacts.potassium,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        potassium: {
                                            ...nutriftionFacts.potassium,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>

                        <View>
                            <TextInput
                                placeholder="Protein"
                                value={nutriftionFacts.protein.measurment.toString()}
                                onChangeText={ 
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        protein: {
                                            ...nutriftionFacts.protein,
                                            measurment: Number(text)
                                        }
                                    })
                                }
                            />

                            <DropDown
                                items={ units.map( unit => (unit) )}
                                
                                onPress={
                                    text => setNutriftionFacts({
                                        ...nutriftionFacts,
                                        protein: {
                                            ...nutriftionFacts.potassium,
                                            unit: text as NutritionUnits
                                        }
                                    })
                                }
                            />
                        </View>
                    </ScrollView>

                    <Text>Create Food</Text>
                </View>
            </View>
        </AppLayout>
    )
}

const styles = StyleSheet.create({

})

export default FoodCreate;
