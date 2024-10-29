// import { createContext, useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";

// const INITIAL_STATE = {
//   client: null,
// };
// type IContextType = {
//   client: Client | null;
// };

// const WebSocketContext = createContext<IContextType>(INITIAL_STATE);

// const WebSocketProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [client, setClient] = useState<Client | null>(null);

//   useEffect(() => {
//     const stompClient = new Client({
//       webSocketFactory: () =>
//         new WebSocket("ws://localhost:15674/ws"),

//       onConnect: () => {
//         console.log("WebSocket connected");
//       },
//       connectHeaders: {
//         login: "guest",
//         passcode: "guest",
//       },
//       onDisconnect: () => {
//         console.log("WebSocket disconnected");
//       },
//       onStompError: (err) => {
//         console.log(err);
//       },
//       onWebSocketError: (err) => {
//         console.log(err);
//       },
//       // debug: (str) => {
//       //   console.log(new Date(), str);
//       // },
//       // reconnectDelay: 5000,
//       // heartbeatIncoming: 2000,
//       // heartbeatOutgoing: 2000,
//     });

//     stompClient.activate();

//     setClient(stompClient);

//     return () => {
//       if (stompClient.connected) {
//         stompClient.deactivate();
//       }
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={{ client }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export { WebSocketContext, WebSocketProvider };

import React, { createContext, useContext, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { setStompClient } from "@/redux/webSocketSlice";
import { RootState } from "@/redux/store";

const WebSocketContext = createContext<Client | null>(null);

export const WebSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch();
  const stompClient = useSelector(
    (state: RootState) => state.webSocket.stompClient
  );

  useEffect(() => {
    if (!stompClient) {
      const client = new Client({
        webSocketFactory: () =>
          new WebSocket("ws://localhost:15674/ws"),
        brokerURL: "ws://localhost:15674/ws",
        debug: (str) => {
          console.log(new Date(), str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 2000,
        heartbeatOutgoing: 2000,
      });

      client.onConnect = () => {
        console.log("Connected");
      };

      client.onDisconnect = () => {
        console.log("Disconnected");
      };

      client.activate();
      dispatch(setStompClient(client));
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        dispatch(setStompClient(null));
      }
    };
  }, [dispatch, stompClient]);

  return (
    <WebSocketContext.Provider value={stompClient}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
