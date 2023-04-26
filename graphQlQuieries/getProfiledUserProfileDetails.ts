export const getProfiledUserProfileDetails = `
    mutation getProfiledUserProfileDetails($token: String!, $profiledUserId: String!) {
        getProfiledUserProfileDetails(token: $token, profiledUserId: $profiledUserId) {
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
            isUserFollowing
            isUserMatched
        }
    }
`;
