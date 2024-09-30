import React, { useCallback, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import config from '../configs/config';
import SocketContext from './socketContext';


function SocketContextProvider({children})
{

    // socket
    const socket = useRef(null);

    // is connected
    const [isSocketConnected, setSocketConnected] = useState(false);

    // connector
    const connectSocket = ({jwt})=>
    {
        socket.current = io(config.baseUrl, {
            extraHeaders: {
                Authorization: `Bearer ${jwt}`
            }
        });
        setSocketConnected(true);
    };

    // disconnector
    const disconnectSocket =()=>
    {
        socket.current?.disconnect();
        setSocketConnected(false);
    };

    // method to add event listener
    // will call only if socket is connected
    const socketOn = (eventName, callback)=>
    {
        socket.current.on(eventName, callback);
    };

    // method to remove event listener
    const removeListeners = (eventName)=>
    {
        socket.current?.removeAllListeners(eventName);
    };

    return (

        <SocketContext.Provider value={{connectSocket, disconnectSocket, isSocketConnected, socketOn, removeListeners}}>
            {children}
        </SocketContext.Provider>

    )
};

export default SocketContextProvider;