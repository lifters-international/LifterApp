export const getUserUnAcceptedMatches = `
    mutation GetUserUnAcceptedMatches($token: String!) {
        getUserUnAcceptedMatches(token: $token) {
            matches {
                id
                profilePicture
                name
                date
            }
        }
    }
`