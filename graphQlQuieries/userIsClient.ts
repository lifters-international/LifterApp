export const userIsClient = `
    query UserGetClient($trainerId: String!, $token: String!) {
        userIsClient(trainerId: $trainerId, token: $token) {
            clientExist
            price
            name
            profilePicture
            email
            banner
            cancelCost
            hasDefaultPaymentMethod
            clientStatement
            clientId
        }
    }
`;
