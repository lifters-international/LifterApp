export const userLogInMutation = `
    mutation LogIn($password: String!, $username: String!) {
        logIn(password: $password, username: $username) {
            token
        }
    }
`