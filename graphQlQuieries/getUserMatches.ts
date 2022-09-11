export const getUserMatches = `
    mutation GetUserMatches($times: Float!, $token: String!) {
        getUserMatches(times: $times, token: $token) {
            id
            username
            email
            age
            gender
            genderOfPrefense
            bio
            profilePicture
        }
    }
`