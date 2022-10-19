import React from "react";

import { StyleSheet, View, ScrollView, Text } from "react-native";

import { Food, verticalScale, moderateScale } from "../utils";

import { useAddFoodToLiftersDailyFood } from "../hooks";

import Button from "./Button";

export type Props = {
    action?: boolean
} & Food;

const FoodView: React.FC<Props> = ({ id, name, calories, servingSize, nutritionFacts, action }) => {
    const { addFoodToLiftersDailyFood, statement } = useAddFoodToLiftersDailyFood();

    return (
        <View style={styles.container} >
            <Text style={styles.foodName}>{name}</Text>
            <View style={styles.foodImportantInfor}>
                <Text style={styles.foodTextImportant}>Serving Size: {servingSize.measurment}{servingSize.unit}</Text>
                <Text style={styles.foodTextImportant}>Calories: {calories}</Text>
            </View>

            <View>
                <Text style={{ ...styles.foodTextImportant, textAlign: 'center' }}>Nutrition Facts</Text>
                <ScrollView style={styles.nutritionFacts}>
                    <Text style={styles.foodText}>Carbohydrates: {nutritionFacts.totalCarbohydrate.measurment}{nutritionFacts.totalCarbohydrate.unit}</Text>
                    <Text style={styles.foodText}>Protein: {nutritionFacts.protein.measurment}{nutritionFacts.protein.unit}</Text>
                    <Text style={styles.foodText}>Total Fat: {nutritionFacts.totalFat.measurment}{nutritionFacts.totalFat.unit}</Text>
                    <Text style={styles.foodText}>Saturated Fat: {nutritionFacts.saturatedFat.measurment}{nutritionFacts.saturatedFat.unit}</Text>
                    <Text style={styles.foodText}>Cholesterol: {nutritionFacts.cholesterol.measurment}{nutritionFacts.cholesterol.unit}</Text>
                    <Text style={styles.foodText}>Sodium: {nutritionFacts.sodium.measurment}{nutritionFacts.sodium.unit}</Text>
                    <Text style={styles.foodText}>Dietary Fiber: {nutritionFacts.dietaryFiber.measurment}{nutritionFacts.dietaryFiber.unit}</Text>
                    <Text style={styles.foodText}>Total Sugars: {nutritionFacts.totalSugars.measurment}{nutritionFacts.totalSugars.unit}</Text>
                    <Text style={styles.foodText}>Added Sugars: {nutritionFacts.addedSugars.measurment}{nutritionFacts.addedSugars.unit}</Text>
                    <Text style={styles.foodText}>Vitamin D: {nutritionFacts.vitaminD.measurment}{nutritionFacts.vitaminD.unit}</Text>
                    <Text style={styles.foodText}>Calcium: {nutritionFacts.calcium.measurment}{nutritionFacts.calcium.unit}</Text>
                    <Text style={styles.foodText}>Iron: {nutritionFacts.iron.measurment}{nutritionFacts.iron.unit}</Text>
                    <Text style={styles.foodText}>Potassium: {nutritionFacts.potassium.measurment}{nutritionFacts.potassium.unit}</Text>
                </ScrollView>
            </View>

            {
                action ? (
                    <Button
                        title={statement}
                        onPress={() => addFoodToLiftersDailyFood(id)}
                        style={styles.button}
                        textStyle={{ textAlign: 'center', color: 'white', fontSize: moderateScale(20) }}
                    />
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
        borderColor: 'gainsboro',
        padding: moderateScale(15),
        marginRight: "auto",
        marginLeft: "auto",
        marginBottom: moderateScale(15),
        marginTop: moderateScale(10),
        borderRadius: moderateScale(10),
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        borderWidth: moderateScale(2),
    },

    foodName: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: moderateScale(10),
        fontStyle: 'italic',
        textDecorationLine: "underline"
    },

    foodImportantInfor: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    foodText: {
        fontSize: moderateScale(15)
    },

    foodTextImportant: {
        fontSize: moderateScale(15),
        fontWeight: 'bold'
    },

    nutritionFacts: {
        maxHeight: verticalScale(100),
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: 'gainsboro',
        borderRadius: moderateScale(5),
        padding: moderateScale(5)
    },

    button: {
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
        backgroundColor: 'dodgerblue',
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        width: '100%'
    }
});

export default FoodView;
