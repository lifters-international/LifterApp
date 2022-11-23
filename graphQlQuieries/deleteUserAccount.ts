export const deleteUserAccount = `
    mutation DeleteUserAccount($password: String!, $email: String!) {
        deleteUserAccount(password: $password, email: $email) {
            key
            type
            value
        }
    }
`;
