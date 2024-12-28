import Sidebar from "@/components/shared/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const stompClient = useWebSocket();
  const basePath = location.pathname === "/";

  useEffect(() => {
    if (stompClient?.connected && currentUser?.username) {
      const subscription = stompClient.subscribe(
        `/queue/${currentUser.username}`,
        (message: { body: string }) => {
          console.log(message);
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            console.log(newMessage);
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
      </div>
    </>
  );
};

export default Home;
