export const searchUserAndTrainers = `
query searchUserAndTrainers($token : String!, $search: String!) {
    searchUserAndTrainers(token: $token, search : $search ) {
        results {
            type
            
            lifters {
                id
                username
                email
                age
                gender
                genderOfPrefense
                bio
                profilePicture
                homeGymLocation
            }

            trianer {
                id
                name
                bio
                profilePicture
                productId
                ratingsAverage
                price
            }
        }
    }
}
`;
