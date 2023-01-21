export const getAcceptedClientTrainers = `
mutation getAcceptedClientTrainers($token: String!) {
    getAcceptedClientTrainers(token: $token) {
      id
      name
      profilePicture
      lastMessage {
        id
        message
        createdAt
        metaDataType
        status
        timeRead
        whoSent
      }
      date
      lastMessageDate
      unreadMessages
    }
  }
`;
