import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";

interface WebSocketState {
  stompClient: Client | null;
}

const initialState: WebSocketState = {
  stompClient: null,
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setStompClient(state, action: PayloadAction<Client | null>) {
      state.stompClient = action.payload;
    },
  },
});

export const { setStompClient } = webSocketSlice.actions;
export default webSocketSlice.reducer;
