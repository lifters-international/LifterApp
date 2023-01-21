export const becomeClientSubSecrets = `
    query BecomeClientSubSecrets($trainerId: String!, $token: String!) {
        becomeClientSubSecrets(trainerId: $trainerId, token: $token) {
            clientSecret
        }
    }
`;
