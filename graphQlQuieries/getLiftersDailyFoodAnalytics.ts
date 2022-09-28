export const getLiftersDailyFoodAnalytics = `
    mutation GetLiftersDailyFoodAnalytics($token: String!, $date: String!) {
        getLiftersDailyFoodAnalytics(token: $token, date: $date) {
            Calories
            Fat
            Carbs
            Protein
            CalorieGoal
            FatsGoal
            CarbsGoal
            ProteinGoal
            Foods {
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
    }
`