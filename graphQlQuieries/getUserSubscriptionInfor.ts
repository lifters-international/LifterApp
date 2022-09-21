export const getUserSubscriptionInfor = `
    query GetUserSubscriptionInfor($token: String!) {
        getUserSubscriptionInfor(token: $token) {
            id
            username
            email
            age
            gender
            genderOfPrefense
            bio
            profilePicture
            homeGymLocation
            stripeSubscriptionId
        }
    }
`;