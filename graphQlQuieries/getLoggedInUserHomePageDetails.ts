export const getLoggedInUserHomePageDetails = `
    mutation GetLoggedInUserHomePageDetails($token: String!) {
        getLoggedInUserHomePageDetails(token: $token) {
            followers
            following
            id
            reels {
                id
                video_url
                caption
            }
            username
            profilePicture
            bio
        }
    }
`;
