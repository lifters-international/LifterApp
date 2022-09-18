export const getUserMatchDetails = `
    mutation GetUserMatchDetails($matchId: String!, $token: String!) {
        getUserMatchDetails(matchId: $matchId, token: $token) {
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