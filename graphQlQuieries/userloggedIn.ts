export const userHasLoggedInMutation = `
    mutation isLoggedIn($token: String!) {
        isLoggedIn(token: $token) 
    }
`