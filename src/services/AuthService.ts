import { ILoginForm, IRegisterForm } from "@/types";
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

export const login = (userForm: ILoginForm) => {
  try {
    const res = API.post("api/v1/auth/login", userForm);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const register = (userForm: IRegisterForm) => {
  try {
    const res = API.post("api/v1/auth/register", userForm);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};
