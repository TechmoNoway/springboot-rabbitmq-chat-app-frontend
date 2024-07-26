import { changeUserStatus } from "@/services/UserService";
import { useEffect } from "react";

const useUserActivity = (userId: number) => {
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      changeUserStatus(userId, "online");
      inactivityTimer = setTimeout(() => {
        changeUserStatus(userId, "away");
      }, 3 * 60 * 1000); // 10 minutes of inactivity
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [userId]);
};

export default useUserActivity;
