import React from "react";

import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";

import { Food, verticalScale, moderateScale, scale } from "../utils";

import { useAddFoodToLiftersDailyFood } from "../hooks";

import { AntDesign } from '@expo/vector-icons';

export type Props = {
    action?: boolean
} & Food;

const FoodView: React.FC<Props> = ({ id, name, calories, servingSize, nutritionFacts, action, adminCreated }) => {
    const { addFoodToLiftersDailyFood, statement } = useAddFoodToLiftersDailyFood();

    return (
        <View style={styles.container} >
            <View style={{ borderBottomWidth: moderateScale(0.8), borderColor: '#5e5c5c', display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.foodName}>{name}</Text>
                { 
                    adminCreated && <AntDesign 
                        name="checkcircleo" 
                        size={moderateScale(25)} color="green" 
                        style={{ position: "relative", left: scale(1.5), top: verticalScale(-6.5) }}
                    />
                }
            </View>

            <View style={styles.foodImportantInfor}>
                <View>
                    <Text style={{...styles.foodTextImportant, color: "#5e5c5c" }}>Serving Size: </Text>
                    <Text style={styles.foodTextImportant}>{servingSize.measurment}{servingSize.unit}</Text>
                </View>
                
                <View>
                    <Text style={{...styles.foodTextImportant, color: "#5e5c5c" }}>Calories: </Text>
                    <Text style={styles.foodTextImportant}>{calories}</Text>
                </View>
            </View>

            <View style={{ borderTopWidth: moderateScale(0.8), borderColor: '#5e5c5c' }}>
                <Text style={{ ...styles.foodTextImportant, textAlign: 'center', marginTop: moderateScale(20) }}>NUTRITION FACTS</Text>
                <ScrollView style={styles.nutritionFacts}>
                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Carbohydrates: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.totalCarbohydrate.measurment}{nutritionFacts.totalCarbohydrate.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Protein: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.protein.measurment}{nutritionFacts.protein.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Total Fat: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.totalFat.measurment}{nutritionFacts.totalFat.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Total Fat: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.totalFat.measurment}{nutritionFacts.totalFat.unit}</Text>
                    </View>
                    
                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Saturated Fat: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.saturatedFat.measurment}{nutritionFacts.saturatedFat.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Cholesterol: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.cholesterol.measurment}{nutritionFacts.cholesterol.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Sodium: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.sodium.measurment}{nutritionFacts.sodium.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Dietary Fiber: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.dietaryFiber.measurment}{nutritionFacts.dietaryFiber.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Total Sugars: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.totalSugars.measurment}{nutritionFacts.totalSugars.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Added Sugars: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.addedSugars.measurment}{nutritionFacts.addedSugars.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Vitamin D: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.vitaminD.measurment}{nutritionFacts.vitaminD.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Calcium: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.calcium.measurment}{nutritionFacts.calcium.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Iron: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.iron.measurment}{nutritionFacts.iron.unit}</Text>
                    </View>

                    <View style={styles.foodImportantInfors}>
                        <Text style={styles.foodText}>Potassium: </Text>
                        <Text style={{...styles.foodText, color: "white"}}>{nutritionFacts.potassium.measurment}{nutritionFacts.potassium.unit}</Text>
                    </View>
                </ScrollView>
            </View>

            {
                action ? (
                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            bottom: verticalScale(-35),
                            right: scale(-40),
                            width: scale(200),
                            zIndex: 1,
                        }}
                    >
                        <TouchableOpacity onPress={() => addFoodToLiftersDailyFood(id)} style={styles.button}>
                            <Text style={{ color: "white", fontSize: moderateScale(25), textAlign: "center", position: "absolute", top: verticalScale(10), left: scale(10) }}>{statement}</Text>
                            <AntDesign name="plus" size={moderateScale(40)} color="white" style={{ position: "absolute", left: scale(238), top: verticalScale(4) }}/>
                        </TouchableOpacity>
                    </View>
                ) : null
            }
        </View>
    )
}

FoodView.defaultProps = {
    action: true
}

const styles = StyleSheet.create({
    container: {
        padding: scale(15),
        marginRight: "auto",
        marginLeft: "auto",
        width: '90%',
        height: verticalScale(465),
        borderWidth: moderateScale(1),
        backgroundColor: '#222121',
        marginBottom: moderateScale(20),
    },

    foodName: {
        fontSize: moderateScale(30),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: moderateScale(20),
        fontStyle: 'italic',
        color: "white"
    },

    foodImportantInfor: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', 
        marginTop: moderateScale(20),
        marginBottom: moderateScale(20)
    },

    foodImportantInfors: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', 
        marginBottom: moderateScale(5)
    },

    foodText: {
        fontSize: moderateScale(20),
        color: '#5e5c5c'
    },

    foodTextImportant: {
        fontWeight: 'bold',
        color: "white",
        fontSize: moderateScale(20),
    },

    nutritionFacts: {
        maxHeight: verticalScale(100),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        borderRadius: moderateScale(5),
        padding: moderateScale(5)
    },

    button: {
        width: scale(280),
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "#FF3636",
        display: "flex",
        flexDirection: "row",
        marginBottom: moderateScale(10),
        height: verticalScale(50)
    }
});

export default FoodView;
