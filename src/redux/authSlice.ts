import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthdate: string;
}

const initialState: AuthState = {
  id: 0,
  username: "",
  email: "",
  avatarUrl: "",
  phoneNumber: "",
  birthdate: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.avatarUrl = action.payload.avatarUrl;
      state.phoneNumber = action.payload.phoneNumber;
      state.birthdate = action.payload.birthdate;
    },
    logout: (state) => {
      state.id = 0;
      state.username = "";
      state.email = "";
      state.avatarUrl = "";
      state.phoneNumber = "";
      state.birthdate = "";
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
