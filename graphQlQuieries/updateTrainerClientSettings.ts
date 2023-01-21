export const updateTrainerClientSettings = `
mutation UpdateTrainerClientInformation($infor: UpdateTrainerClient!, $clientId: String!, $token: String!) {
    updateTrainerClientInformation(infor: $infor, clientId: $clientId, token: $token) {
      key
      type
      value
    }
  }
`;
