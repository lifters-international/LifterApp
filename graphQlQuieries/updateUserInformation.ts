export const updateUserInformationMutation = `
    mutation Mutation($userInfor: UserInformationInput!, $token: String!) {
        updateUserInformation(userInfor: $userInfor, token: $token) {
            key
            value
            type
        }
    }
`;