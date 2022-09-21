export const updateUserPassword = `
    mutation UpdateUserPassword($newPassword: String!, $oldPassword: String!, $token: String!) {
        updateUserPassword(newPassword: $newPassword, oldPassword: $oldPassword, token: $token) {
            key
            value
            type
        }
    }
`;