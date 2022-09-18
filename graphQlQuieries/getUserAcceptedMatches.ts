export const getUserAcceptedMatches = `
    mutation GetUserAcceptedMatches($token: String!) {
        getUserAcceptedMatches(token: $token) {
            id
            profilePicture
            name
            lastMessage {
                id
                status
                whoSent
                metaDataType
                message
                createdAt
            }
            lastMessageDate
            unreadMessages
        }
    }
`