export const cancelCreateTrainersRequest = `
query CancelCreateClientRequest($trainerId: String!, $token: String!) {
    cancelCreateClientRequest(trainerId: $trainerId, token: $token) {
      id
    }
  }
`;
