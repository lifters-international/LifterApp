export const userFollowerProfiledUser = `
    mutation userFollowerProfiledUser($token: String!, $profiledUserId: String!) {
        userFollowerProfiledUser(token: $token, profiledUserId: $profiledUserId)
    }
`