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

export const watchTrainerVideoV401 = `
    mutation WatchTrainerVideoV401( $token: String!, $videoId: String!) {
        WatchTrainerVideoV401( token: $token, videoId: $videoId ) {
            video {
                id
                title
                description
                clientCount
                isClient
                trainerId
                trainerProfile
                trainerName
                url
                likes
                dislikes
                views
                date
                thumbnail
            }

            comments {
                id
                comment
                createdAt
                updatedAt
                whoCreatedType
                whoCreatedId
                parentId
                childrenCount
                whoCreatedProfilePicture
                whoCreatedName
            }

            recommendedVideos {
                id
                title
                duration
                thumbnail
                updatedAt
                views
            }

            viewHistoryId

            allowLikes

            allowDislikes

            allowComments
        }
    }
`;
