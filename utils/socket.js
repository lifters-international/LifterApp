const { io } = require("socket.io-client");

const getServerUrl = () => {
    return process.env.NODE_ENV === "production" ? "https://server.lifters.app/" : "http://localhost:5000/";
}

const socketMessagesEvent = {
    ChangeMatchesOrder: () => {},
    authenticated: () => {},
    NewMessage: () => {},
    newUserMatches: () => {},
}

const socketVideoEvent = {
    joinedVideoRoom: () => {},
    YouLikedVideo: () => {},
    YouDisLikedVideo: () => {},
    LikedVideo: () => {},
    DisLikedVideo: () => {},
    newComment: () => {}
}

const socketTrainerClientEvent = {
    ChangeClientsOrder: () => {},
    authenticated: () => {},
    NewMessage: () => {}
}

const messagesSocket = io(getServerUrl()+ "messages");

const videoSocket = io(getServerUrl()+"trainerVideos");

const trainerClientSocket = io(getServerUrl()+"trainersClient");

messagesSocket.onAny( ( event, arg ) => {
    try {
        socketMessagesEvent[event](arg);
    }catch(err) {
        console.log(err)
    }
});

videoSocket.onAny( (event, arg ) => {
    try {
        socketVideoEvent[event](arg);
    }catch(err) {
        console.log(err);
    }
})

trainerClientSocket.onAny( (event, arg ) => {
    try {
        socketTrainerClientEvent[event](arg);
    }catch(err) {
        console.log(err);
    }
});

module.exports = {

    // Match Messaging Socket Events
    messagesAuthenticate: ( token ) => {
        messagesSocket.emit("authenticate", { token });
    },

    onMessages: ( event, callback ) => {
        socketMessagesEvent[event] = callback;
    },

    messagesEmit: ( event, args ) => {
        messagesSocket.emit(event, args);
    },

    // Video Socket Events

    onVideo: ( event, callback ) => {
        socketVideoEvent[event] = callback;
    },

    videoEmit: ( event, args ) => {
        videoSocket.emit( event, args)
    },

    // Trainer Client Socket Events

    trainerClientAuthenticate: ( token ) => {
        trainerClientSocket.emit("authenticate", { token });
    },

    onTrainerClient: ( event, callback ) => {
        socketTrainerClientEvent[event] = callback;
    },

    trainerClientEmit: ( event, args ) => {
        trainerClientSocket.emit( event, args)
    }
};
