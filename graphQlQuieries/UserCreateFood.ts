export const UserCreateFood = `
    mutation UserCreateFood($foodInput: FoodInformationInput!, $token: String!) {
        UserCreateFood(foodInput: $foodInput, token: $token) {
            id

            name

            servingSize {
                measurment
                unit
            }

            calories

            nutritionFacts {
                totalFat {
                    measurment
                    unit
                }

                saturatedFat {
                    measurment
                    unit
                }

                transFat {
                    measurment
                    unit
                }

                cholesterol {
                    measurment
                    unit
                }

                sodium {
                    measurment
                    unit
                }

                totalCarbohydrate {
                    measurment
                    unit
                }

                dietaryFiber {
                    measurment
                    unit
                }

                totalSugars {
                    measurment
                    unit
                }

                addedSugars {
                    measurment
                    unit
                }

                protein {
                    measurment
                    unit
                }

                vitaminD {
                    measurment
                    unit
                }

                calcium {
                    measurment
                    unit
                }

                iron {
                    measurment
                    unit
                }

                potassium {
                    measurment
                    unit
                }
            }
        }
    }
`;
