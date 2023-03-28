export const createLifterReels = `
    mutation CreateLifterReels($reelsInput: CreateLifterReelsInput!, $token: String!) {
        createLifterReels(reelsInput: $reelsInput, token: $token) {
            id
        }
    }
`