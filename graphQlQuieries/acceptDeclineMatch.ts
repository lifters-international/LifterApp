export const acceptDeclineMatch = `
    mutation AcceptDeclineMatch($accept: Boolean!, $matchId: String!, $token: String!) {
        acceptDeclineMatch(accept: $accept, matchId: $matchId, token: $token)
    }
`