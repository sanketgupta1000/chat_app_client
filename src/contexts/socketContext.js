import { createContext } from "react";

const SocketContext = createContext({
    connectSocket: ({jwt}) => {},
    disconnectSocket: () => {},
    isSocketConnected: null,
    socketOn: (eventName, callback) => {},
    removeListeners: (eventName)=>{}
});

export default SocketContext;