import Sidebar from "@/components/shared/Sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { logout, setUser } from "@/redux/authSlice";
import {
  changeUserStatus,
  getCurrentUser,
} from "@/services/UserService";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state: any) => state?.auth);
  const stompClient = useSelector((state: any) => state?.stompClient);
  const [onCallingDialogOpen, setOnCallingDialogOpen] =
    useState(false);
  const basePath = location.pathname === "/";

  const checkAuthUser = async () => {
    const token = localStorage.getItem("token");

    if (token == undefined || token == null || token == "") {
      dispatch(logout());
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
        dispatch(logout());
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

  useEffect(() => {
    if (stompClient?.connected) {
      console.log("stomp client is connected");
      stompClient.subscribe(
        `/queue/${currentUser.username}`,
        (message: { body: string }) => {
          console.log(message);
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            console.log(newMessage);

            setOnCallingDialogOpen(true);
          } else {
            console.log("got empty message");
          }
        }
      );
    }
  }, [stompClient?.connected, currentUser]);

  return (
    <>
      <div className="relative grid lg:grid-cols-[370px,1fr] w-screen h-screen max-h-screen">
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

        <Dialog open={onCallingDialogOpen}>
          <DialogContent className="justify-center w-72 h-80 bg-neutral-900 rounded-lg border-none">
            <DialogHeader className="text-white flex items-center">
              <DialogTitle>Call comming</DialogTitle>
            </DialogHeader>

            <Avatar className="flex items-center justify-center">
              <AvatarImage
                className="w-20 h-20"
                // src={dataPartner?.avatarUrl}
              />
              <AvatarFallback className="w-20 h-20 bg-slate-200 flex text-black items-center justify-center">
                {/* <p>{(dataPartner?.username)[0]}</p> */}
              </AvatarFallback>
            </Avatar>

            <Label className="text-xl font-bold text-white">
              Bob456 is calling you
            </Label>

            <div className="flex justify-center mt-8 space-x-9">
              <Button
                type="submit"
                className="rounded-full bg-red-500 w-10 h-10"
                onClick={() => setOnCallingDialogOpen(false)}
              >
                <IoClose className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-green-500 w-10 h-10"
                onClick={() => setOnCallingDialogOpen(false)}
              >
                <IoIosCall className="h-5 w-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Home;
