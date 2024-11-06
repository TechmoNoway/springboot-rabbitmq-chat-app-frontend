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
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { useEffect, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const stompClient = useWebSocket();
  const [onCallingDialogOpen, setOnCallingDialogOpen] =
    useState(false);
  const [latestReceivedMessage, setLatestReceivedMessage] =
    useState<any>();
  const basePath = location.pathname === "/";

  const handleAcceptJoinCall = () => {
    if (stompClient && stompClient.connected) {
      const width = 1200;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2 - 40;

      window.open(
        latestReceivedMessage?.linkRoomCall,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      setOnCallingDialogOpen(false);
    }
  };

  const handleDeclineJoinCall = () => {
    setOnCallingDialogOpen(false);
  };

  useEffect(() => {
    if (stompClient?.connected && currentUser?.username) {
      const subscription = stompClient.subscribe(
        `/queue/${currentUser.username}`,
        (message: { body: string }) => {
          console.log(message);
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            console.log(newMessage);
            setLatestReceivedMessage(newMessage);
            setOnCallingDialogOpen(true);
          } else {
            console.log("got empty message");
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient?.connected, currentUser?.username]);

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
                onClick={handleDeclineJoinCall}
              >
                <IoClose className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-green-500 w-10 h-10"
                onClick={handleAcceptJoinCall}
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
