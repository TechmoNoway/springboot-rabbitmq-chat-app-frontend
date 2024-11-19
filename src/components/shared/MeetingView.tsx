import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantView from "./ParticipantView";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { LucideScreenShare } from "lucide-react";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from "react-icons/bs";
import { FaPhoneSlash } from "react-icons/fa6";
import { FiMic, FiMicOff } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

interface MeetingViewProps {
  onMeetingLeave: () => void;
  meetingId: string;
  currentUser: any;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  onMeetingLeave,
  meetingId,
  currentUser,
}) => {
  const [joined, setJoined] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [searchParams] = useSearchParams();
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");
  const { join, participants, leave, toggleMic, toggleWebcam } =
    useMeeting({
      onMeetingJoined: () => {
        toggleWebcam();
        toggleMic();
        setJoined("JOINED");
      },
      onMeetingLeft: () => {
        onMeetingLeave();
      },
    });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const handleToggleTurnOnScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleToggleTurnOnCamera = () => {
    toggleWebcam();
    setIsCameraOn(!isCameraOn);
  };

  const handleToggleTurnOnMic = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  const handleEndCall = () => {
    leave();
    window.close();
  };

  useEffect(() => {
    joinMeeting();
    console.log(currentUser);
  }, [currentUser]);

  return (
    <div className="flex flex-col h-screen w-screen justify-between bg-[#1c1c1c] text-foreground relative">
      <h3 className="text-white">Meeting Id: {meetingId}</h3>
      <div>
        <div className="flex space-x-6 justify-center pb-2 mb-8">
          {/* Share screen */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-neutral-600 w-12 h-12 rounded-full">
                  <LucideScreenShare className="w-8 h-8" />
                  {/* <LucideScreenShareOff /> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                className="bg-black text-white mr-11"
              >
                <p className="">Share screen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Toggle Camera */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-neutral-600 w-12 h-12 rounded-full"
                  onClick={handleToggleTurnOnCamera}
                >
                  {isCameraOn ? (
                    <BsCameraVideoFill className="w-8 h-8" />
                  ) : (
                    <BsCameraVideoOffFill className="w-8 h-8" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                className="bg-black text-white mr-11"
              >
                <p className="">Turn on cammera</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Toggle Mic */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-12 h-12 rounded-full bg-neutral-600"
                  onClick={handleToggleTurnOnMic}
                >
                  {isMicOn ? (
                    <FiMic className="w-8 h-8" />
                  ) : (
                    <FiMicOff className="w-8 h-8" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                className="bg-black text-white mr-11"
              >
                <p className="">Turn on mic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* End Call */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-destructive w-12 h-12 rounded-full"
                  onClick={handleEndCall}
                >
                  <FaPhoneSlash className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                className="bg-black text-white mr-11"
              >
                <p className="">End call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {[...participants.keys()].map((participantId) => (
          <ParticipantView
            participantId={participantId}
            key={participantId}
            className={
              currentUser?.id
                ? "absolute bottom-0 right-0 mb-5 mr-5 h-44 rounded-lg p-0"
                : "items-center justify-center h-full mb-4 space-y-3"
            }
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default MeetingView;
