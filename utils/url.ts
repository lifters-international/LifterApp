export const getApiUrl = () => {
    return `${getServerUrl()}graphql`;
}

export const getWSApiUrl = () => {
    return  `wss://${process.env.NODE_ENV === "production" ? "server.lifters.app" : "10.0.0.169:5000"}/graphql`;
}

export const getImageUploadApi = () => {
    return `${getServerUrl()}upload/image`;
}

export const getServerUrl = () => {
    return process.env.NODE_ENV === "production" ? "https://server.lifters.app/" : "http://10.0.0.169:5000/";
}