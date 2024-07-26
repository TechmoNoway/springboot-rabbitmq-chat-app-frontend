import { IMessage } from "@/types";
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

export const getMessagesBetweenTwoUsers = (
  user1Id: number,
  user2Id: number
) => {
  try {
    const res = API.get(
      `api/v1/messages/getMessageBetweenTwoUsers?user1Id=${user1Id}&user2Id=${user2Id}`
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const saveMessage = (messageForm: IMessage) => {
  try {
    const res = API.post(`api/v1/messages/saveMessage`, messageForm);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};
