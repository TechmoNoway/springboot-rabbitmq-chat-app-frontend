import { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const INITIAL_STATE = {
  client: null,
};
type IContextType = {
  client: Client | null;
};

const WebSocketContext = createContext<IContextType>(INITIAL_STATE);

const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new WebSocket("ws://localhost:15674/ws"),

      onConnect: () => {
        console.log("WebSocket connected");
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
      onStompError: (err) => {
        console.log(err);
      },
      onWebSocketError: (err) => {
        console.log(err);
      },
    });

    stompClient.activate();

    setClient(stompClient);

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ client }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
