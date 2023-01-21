export const getTrainersDetailsById = `
    query getTrainersDetailsById($id: String!) {
        getTrainersDetailsById(id: $id) {
            id
            name
            bio
            profilePicture
            bannerImage
            clientCount
            gymCount
            price
            onBoardCompleted
            gyms {
              id
              location
            }
            ratingsAverage
            ratings {
              comment
              rating
              lifterProfilePicture
              lifterName
              id
              createdAt
            }
        }
    }
`;
