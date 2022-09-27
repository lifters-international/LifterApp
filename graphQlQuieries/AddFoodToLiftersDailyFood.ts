export const AddFoodToLiftersDailyFood = `
    mutation AddFoodToLiftersDailyFood($foodId: String!, $token: String!) {
        addFoodToLiftersDailyFood(foodId: $foodId, token: $token) {
            id
        }
    }
`
