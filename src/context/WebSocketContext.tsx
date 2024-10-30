import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import { useDispatch } from "react-redux";
import { setStompClient } from "@/redux/webSocketSlice";

const WebSocketContext = createContext<Client | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [stompClient, setStompClientState] = useState<Client | null>(
    null
  );

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new WebSocket("ws://localhost:15674/ws"),
      brokerURL: "ws://your-websocket-url",
      // debug: (str) => {
      //   console.log(new Date(), str);
      // },
      // reconnectDelay: 5000,
      // heartbeatIncoming: 2000,
      // heartbeatOutgoing: 2000,
    });

    client.onConnect = () => {
      console.log("Connected");
      setStompClientState(client);
      dispatch(setStompClient(client));
    };

    client.onDisconnect = () => {
      console.log("Disconnected");
      setStompClientState(null);
      dispatch(setStompClient(null));
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [dispatch]);

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
