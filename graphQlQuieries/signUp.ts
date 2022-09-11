export const userSignUpMutation = `
    mutation SignUp($password: String!, $email: String!, $username: String!) {
        signUp(password: $password, email: $email, username: $username)  {
            key
            value
            type
        }
    }
`