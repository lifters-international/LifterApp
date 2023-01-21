export const userGetAllTrainerVideo = `
    query UserGetAllTrainerVideo($trainerId: String!, $token: String!) {
        userGetAllTrainerVideo(trainerId: $trainerId, token: $token) {
            id
            clientOnly
            duration
            thumbnail
            isClient
            title
            updatedAt
            views
        }
    }
`;
