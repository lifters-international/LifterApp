export const searchFood = `
    mutation UserSearchFoods($search: String!, $token: String!) {
        userSearchFoods(search: $search, token: $token) {
            id
            name
            servingSize {
                measurment
                unit
            }
            calories
            adminCreated
            whoCreated
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
                    unit
                    measurment
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
`