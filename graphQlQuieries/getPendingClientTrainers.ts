export const getPendingClientTrainers  = `
mutation getPendingClientTrainers($token: String!) {
    getPendingClientTrainers(token: $token) {
      id
      name
      profilePicture
      date
    }
  }
`;
