export const searchVideos = `
query SearchVideo($token: String!, $search: String!) {
    searchVideo(token: $token, search: $search) {
      id
      clientOnly
      duration
      isClient
      profilePicture
      thumbnail
      title
      updatedAt
      views
      trainerId
      trainerName
    }
  }
`;
