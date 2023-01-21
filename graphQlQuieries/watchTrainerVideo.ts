export const watchTrainerVideo = `
    mutation WatchTrainerVideo($videoId: String!, $token: String!) {
        WatchTrainerVideo(videoId: $videoId, token: $token) {
            recommendedVideos {
                duration
                id
                thumbnail
                title
                updatedAt
                views
            }
            video {
                dislikes
                id
                likes
                url
                clientCount
                description
                isClient
                title
                trainerName
                trainerId
                trainerProfile
                views
                date
                thumbnail
            }
            comments {
                comment
                id
                updatedAt
                whoCreatedId
                whoCreatedName
                whoCreatedProfilePicture
                whoCreatedType
            }
            viewHistoryId
            allowLikes
            allowDislikes
            allowComments
        }
    }
`;
