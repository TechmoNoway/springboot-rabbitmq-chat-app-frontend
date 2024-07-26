import Sidebar from "@/components/shared/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { logout, setUser } from "@/redux/authSlice";
import {
  changeUserStatus,
  getCurrentUser,
} from "@/services/UserService";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const basePath = location.pathname === "/";

  const checkAuthUser = async () => {
    const token = localStorage.getItem("token");

    if (token == undefined || token == null || token == "") {
      dispatch(logout({}));
      if (location.pathname != "/sign-in") {
        toast({
          variant: "destructive",
          title: "Opps! Login session expired",
          description: "Please login again.",
        });
      }
      navigate("/sign-in");
    } else {
      const decodedToken = jwtDecode(token || "");
      const currentUnixTimestamp = Math.floor(Date.now() / 1000);

      if (
        decodedToken.exp !== undefined &&
        decodedToken.exp > currentUnixTimestamp
      ) {
        const userdetailResponse = await getCurrentUser(
          parseInt(decodedToken.sub as string)
        );

        if (userdetailResponse?.data.data) {
          const currentUserInfo = userdetailResponse.data.data;

          localStorage.setItem(
            "info",
            JSON.stringify(currentUserInfo.id)
          );

          changeUserStatus(currentUserInfo.id, "online");

          dispatch(
            setUser({
              id: currentUserInfo.id,
              username: currentUserInfo.username,
              email: currentUserInfo.email,
              avatarUrl: currentUserInfo.avatarUrl,
              phoneNumber: currentUserInfo.phoneNumber,
              birthdate: currentUserInfo.birthdate,
            })
          );
        }
      } else {
        localStorage.setItem("token", "");
        dispatch(logout({}));
        if (location.pathname != "/sign-in") {
          toast({
            variant: "destructive",
            title: "Opps! Login session expired",
            description: "Please login again.",
          });
        }
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <WebSocketProvider>
      <div className="grid lg:grid-cols-[370px,1fr] w-screen h-screen max-h-screen">
        <section
          className={`bg-white ${!basePath && "hidden"} lg:block`}
        >
          <Sidebar />
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`}>
          <Outlet />
        </section>

        <div
          className={`justify-center items-center flex-col gap-2 hidden ${
            !basePath ? "hidden" : "lg:flex"
          }`}
        >
          {/* <div>
            <img src={""} width={250} alt="logo" />
          </div> */}
          <p className="text-lg mt-2 text-slate-500">
            Select user to send message
          </p>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default Home;
