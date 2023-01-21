export const createTrainerRating = `
    mutation CreateTrainerRating($comment: String!, $rating: Float!, $trainerId: String!, $token: String!) {
        createTrainerRating(comment: $comment, rating: $rating, trainerId: $trainerId, token: $token) {
            id
        }
    }
`;
