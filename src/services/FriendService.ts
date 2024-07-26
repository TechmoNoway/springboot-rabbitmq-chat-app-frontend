import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({ baseURL: apiBaseUrl });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${JSON.parse(
      localStorage.getItem("token") ?? ""
    )}`;
  }
  return req;
});

export const checkIsFriend = (userId: number, friendId: number) => {
  try {
    const res = API.get(
      `api/v1/friend/checkIsFriend?userId=${userId}&friendId=${friendId}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addFriend = (userId: number, friendId: number) => {
  try {
    const res = API.post(
      `api/v1/friend/addFriend?userId=${userId}&friendId=${friendId}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removeFriend = (userId: number, friendId: number) => {
  try {
    const res = API.delete(
      `api/v1/friend/removeFriend?userId=${userId}&friendId=${friendId}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};
