import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  username: "",
  email: "",
  avatarUrl: "",
  phoneNumber: "",
  birthdate: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.avatarUrl = action.payload.avatarUrl;
      state.phoneNumber = action.payload.phoneNumber;
      state.birthdate = action.payload.birthdate;
    },
    logout: (state, action) => {
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
