import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Image } from 'react-native';
import { NavigationProp } from "@react-navigation/native";

import { FoodView, Loading, AppLayout, LabelInputDropdown } from "../components";

import { useGetFood, useSearchFood } from "../hooks";

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

    return (
        <AppLayout backgroundColor="black">
            <View>
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
                            (value) => setFoodServing({
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
                                marginTop: verticalScale(20),
                                marginBottom: verticalScale(20),
                                textAlign: "center"
                            }}
                        >Nutrition Facts</Text>
                    </View>

                    <ScrollView contentContainerStyle={{ height: verticalScale(120) }}>
                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Total Fats</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Total Fats"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <LabelInputDropdown
                            label="Total Fats"
                            value={nutriftionFacts.totalFat.measurment.toString()}
                            onTextChange={
                                text => setNutriftionFacts({
                                    ...nutriftionFacts,
                                    totalFat: {
                                        ...nutriftionFacts.totalFat,
                                        measurment: Number(text)
                                    }
                                })
                            }
                            onSelectChange={
                                text => setNutriftionFacts({
                                    ...nutriftionFacts,
                                    totalFat: {
                                        ...nutriftionFacts.totalFat,
                                        unit: text as NutritionUnits
                                    }
                                })
                            }
                            items={units.map(unit => (unit))}
                        />


                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Saturated Fats</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Saturated Fats"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Trans Fats</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Trans Fats"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Cholesterol</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Cholesterol"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Sodium</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Sodium"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Total Carbohydrate</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Total Carbohydrate"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Dietary Fiber</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Dietary Fiber"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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

                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Added Sugars</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Added Sugars"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Total Sugars</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Total Sugars"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Vitamin D</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Vitamin D"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Iron</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Iron"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Calcium</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Calcium"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Potassium</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Potassium"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>

                        <View style={styles.inputDropsContainer}>
                            <Text style={styles.inputDropsLabel}>Protein</Text>

                            <View style={styles.inputDrops}>
                                <TextInput
                                    placeholder="Protein"
                                    placeholderTextColor="#5e5c5c"
                                    keyboardType='numeric'
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
                                    style={styles.inputForDrops}
                                />

                                <DropDown
                                    items={units.map(unit => (unit))}

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
                        </View>
                    </ScrollView>

                    <Text>Create Food</Text>
                </View>
            </View>
        </AppLayout>
    )
}

export default FoodCreate;
