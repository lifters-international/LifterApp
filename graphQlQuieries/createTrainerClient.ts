export const createTrainerClient = `
    query CreateTrainersClient($trainerId: String!, $token: String!) {
        createTrainersClient(trainerId: $trainerId, token: $token) {
            id
        }
    }
`;
