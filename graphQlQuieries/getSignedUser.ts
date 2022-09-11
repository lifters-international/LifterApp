export const getSignedInUserQuery = `
    query GetUser($token: String!) {
        getUser(token: $token) {
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
    }
`