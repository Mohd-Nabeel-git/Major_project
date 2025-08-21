import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],   
    });

    socket.on("connect", () => {
      console.log("Connected to socket server", socket.id);
      socket.emit("join", userId); 
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}

