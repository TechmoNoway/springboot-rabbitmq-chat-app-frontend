import useUserActivity from "@/hooks/useUserActivity";
import { changeUserStatus } from "@/services/UserService";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const user = useSelector((state: any) => state?.auth);

  window.addEventListener("beforeunload", () => {
    changeUserStatus(user.id, "offline");
  });

  window.addEventListener("load", () => {
    changeUserStatus(user.id, "online");
  });

  useUserActivity(user.id);

  return (
    <div>
      <div className="w-full md:flex">
        {/* <Topbar />
        <LeftSidebar /> */}

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>

        {/* <Bottombar /> */}
      </div>
    </div>
  );
};

export default RootLayout;
