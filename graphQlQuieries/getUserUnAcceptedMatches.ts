export const getUserUnAcceptedMatches = `
    mutation GetUserUnAcceptedMatches($token: String!) {
        getUserUnAcceptedMatches(token: $token) {
            userSubscription
            matches {
                id
                profilePicture
                name
                date
            }
        }
    }
`