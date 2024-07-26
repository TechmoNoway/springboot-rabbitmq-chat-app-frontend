// import { getCurrentUser } from "@/services/UserService";
// import { IUser } from "@/types";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useToast } from "@/components/ui/use-toast";

// export const INITIAL_USER = {
//   id: 0,
//   username: "",
//   email: "",
//   avatarUrl: "",
//   phoneNumber: "",
//   birthdate: "",
// };

// export const INITIAL_STATE = {
//   user: INITIAL_USER,
//   isLoading: false,
//   isAuthenticated: false,
//   setUser: () => {},
//   setIsAuthenticated: () => {},
//   checkAuthUser: async () => false as boolean,
// };

// type IContextType = {
//   user: IUser;
//   isLoading: boolean;
//   setUser: React.Dispatch<React.SetStateAction<IUser>>;
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   checkAuthUser: () => Promise<boolean>;
// };

// const AuthContext = createContext<IContextType>(INITIAL_STATE);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState(INITIAL_USER);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();

//   const checkAuthUser = async () => {
//     const token = localStorage.getItem("token");

//     if (token == undefined || token == null || token == "") {
//       return false;
//     } else {
//       const decodedToken = jwtDecode(token || "");
//       const currentUnixTimestamp = Math.floor(Date.now() / 1000);
//       console.log(
//         decodedToken.exp !== undefined &&
//           decodedToken.exp > currentUnixTimestamp
//       );

//       if (
//         decodedToken.exp !== undefined &&
//         decodedToken.exp > currentUnixTimestamp
//       ) {
//         try {
//           const currentAccount = await getCurrentUser(
//             parseInt(decodedToken.sub as string)
//           );

//           if (currentAccount?.data.data) {
//             const currentUserInfo = currentAccount.data.data;

//             setUser({
//               id: currentUserInfo.id,
//               username: currentUserInfo.username,
//               email: currentUserInfo.email,
//               avatarUrl: currentUserInfo.avatarUrl,
//               phoneNumber: currentUserInfo.phoneNumber,
//               birthdate: currentUserInfo.birthdate,
//             });
//             localStorage.setItem("authenticated", JSON.stringify(true));
//             setIsAuthenticated(true);
//             return true;
//           }
//           localStorage.setItem("authenticated", JSON.stringify(false));
//           return false;
//         } catch (error) {
//           console.log(error);
//           localStorage.setItem("authenticated", JSON.stringify(false));
//           return false;
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         localStorage.setItem("token", "");
//         localStorage.setItem("authenticated", JSON.stringify(false));
//         if (location.pathname != "/sign-in") {
//           toast({
//             variant: "destructive",
//             title: "Opps! Login session expired",
//             description: "Please login again.",
//           });
//         }
//         navigate("/sign-in");
//         return false;
//       }
//     }
//   };

//   useEffect(() => {
//     if (
//       localStorage.getItem("authenticated") === "false" ||
//       localStorage.getItem("authenticated") === null
//     ) {
//       navigate("/sign-in");
//     }
//     checkAuthUser();
//   }, []);

//   const value = {
//     user,
//     isLoading,
//     isAuthenticated,
//     setUser,
//     setIsAuthenticated,
//     checkAuthUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthProvider;

// export const useUserContext = () => useContext(AuthContext);
