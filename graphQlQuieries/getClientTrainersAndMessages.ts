export const getClientTrainersAndMessages  = `
query getClientTrainersAndMessages($clientId: String!, $token: String!) {
    getClientTrainersAndMessages(clientId: $clientId, token: $token) {
      dateCreated
      messages {
        id
        createdAt
        message
        metaDataType
        status
        timeRead
        whoSent
      }
      name
      profilePicture
      trainersDecision
      canSeeUserFoodHistory
      trainer
    }
  }
`;
