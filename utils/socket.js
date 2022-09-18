const { io } = require("socket.io-client");
const { getServerUrl } = require("./url");

const events = {
    ChangeMatchesOrder: () => {},
    authenticated: () => {},
    NewMessage: () => {},
    newUserMatches: () => {},
}

const socket = io(getServerUrl()+ "messages");

socket.onAny( ( event, arg ) => {
    try {
        events[event](arg);
    }catch(err) {
        console.log(err)
    }
})

module.exports = {
    authenticate: ( token ) => {
        socket.emit("authenticate", { token });
    },

    on: ( event, callback ) => {
        events[event] = callback;
    },

    emit: ( event, args ) => {
        socket.emit(event, args);
    }
};