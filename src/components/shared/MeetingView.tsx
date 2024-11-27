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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface MeetingViewProps {
  onMeetingLeave: () => void;
  currentUser: any;
  partnerInfo: any;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  onMeetingLeave,
  currentUser,
  partnerInfo,
}) => {
  const [joined, setJoined] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const { join, participants, leave, toggleMic, toggleWebcam } =
    useMeeting({
      onMeetingJoined: () => {
        //TODO: Turn off camera and mic when joining meeting
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
    if (currentUser && partnerInfo) {
      console.log("called");

      joinMeeting();
    }
  }, [currentUser, partnerInfo]);

  return (
    <div className="flex flex-col h-screen w-screen justify-between bg-[#1c1c1c] text-foreground relative">
      {[...participants.keys()].length === 1 && (
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <Avatar>
            <AvatarImage
              className="w-16 h-16"
              src={partnerInfo?.avatarUrl}
            />
            <AvatarFallback className="w-16 h-16 bg-slate-200 flex text-black items-center justify-center">
              <p>{partnerInfo?.username[0]}</p>
            </AvatarFallback>
          </Avatar>
          <p className="text-2xl">Calling...</p>{" "}
        </div>
      )}

      {[...participants.keys()].map((participantId, index) => {
        if (index >= 2) {
          return;
        } else {
          return (
            <ParticipantView
              key={participantId}
              participantId={participantId}
              currentUser={currentUser}
              partnerInfo={partnerInfo}
              index={index}
            />
          );
        }
      })}
      <div className="flex space-x-6 justify-center items-center pb-2 mb-8">
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
    </div>
  );
};

export default MeetingView;
