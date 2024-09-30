import { useContext } from "react";
import SocketContext from "../contexts/socketContext";

function useSocket()
{
    return useContext(SocketContext);
}

export default useSocket;