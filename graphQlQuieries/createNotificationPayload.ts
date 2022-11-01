export const createNotificationPayload = `
    mutation CreateNotificationPayload($payload: NotificationPayloadCreationInput!, $token: String!) {
        createNotificationPayload(payload: $payload, token: $token)
    }
`