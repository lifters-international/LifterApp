export const getUserMessages = `
    mutation GetUserMessages($matchId: String!, $token: String!) {
        getUserMessages(matchId: $matchId, token: $token) {
            whoIsUser
            messages {
                id
                status
                whoSent
                metaDataType
                message
                createdAt
                timeRead
            }
        }
    }
`;