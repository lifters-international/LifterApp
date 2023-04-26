export const profiledUserMatchUnmatchUser = `
    mutation profiledUserMatchUnmatchUser($token: String!, $profiledUserId: String!) {
        profiledUserMatchUnmatchUser(token: $token, profiledUserId: $profiledUserId)
    }
`