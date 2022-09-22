export const subscribeToProLifter =  `
    query Query($paymentMethodId: String!, $token: String!) {
        subscribeToPro(paymentMethodId: $paymentMethodId, token: $token)
    }
`;