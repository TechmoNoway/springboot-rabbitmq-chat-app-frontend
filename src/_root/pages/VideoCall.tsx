import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWebSocket } from "@/context/WebSocketContext";
import { getCurrentUser } from "@/services/UserService";
import {
  LucideScreenShare,
  LucideScreenShareOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from "react-icons/bs";
import { FaPhoneSlash } from "react-icons/fa6";
import { FiMic, FiMicOff } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

const VideoCall: React.FC = () => {
  const [searchParams] = useSearchParams();
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");
  const roomId = searchParams.get("roomId");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  // const clientRef = useRef<Client | null>(null);
  const clientRef = useWebSocket();
  const [dataPartner, setDataPartner] = useState({
    id: 0,
    username: "",
    email: "",
    avatarUrl: "",
    isActive: false,
    birthdate: "",
    phoneNumber: "",
    isBlocked: false,
  });

  const getPartnerData = async () => {
    if (
      JSON.parse(localStorage.getItem("info") || "0") ===
      parseInt(senderId || "0")
    ) {
      const response = await getCurrentUser(
        parseInt(receiverId || "0")
      );
      if (response && response.data.data) {
        setDataPartner({
          ...response.data.data,
        });
      }
    } else {
      const response = await getCurrentUser(
        parseInt(senderId || "0")
      );
      if (response && response.data.data) {
        setDataPartner({
          ...response.data.data,
        });
      }
    }
  };

  //TODO: Implement the following functions
  const handleToggleTurnOnScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleToggleTurnOnCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleToggleTurnOnMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleEndCall = () => {
    window.close();
  };

  const handleGetCurrentUser = async () => {
    const response = await getCurrentUser(
      JSON.parse(localStorage.getItem("info") || "0")
    );
    setCurrentUser(response?.data?.data);
    return response?.data?.data;
  };

  // TODO: Fix the issue with the camera
  useEffect(() => {
    if (isCameraOn || isMicOn) {
      navigator.mediaDevices
        .getUserMedia({ video: isCameraOn, audio: isMicOn })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.log("Error accessing media devices:", error);
        });
    } else {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
  }, [isCameraOn, isMicOn]); //   clientRef.current = new Client({
  //     brokerURL: "ws://localhost:15674/ws",
  //     connectHeaders: {
  //       login: "guest",
  //       passcode: "guest",
  //     },
  //     debug: (str) => {
  //       console.log(str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //     webSocketFactory: () =>
  //       new WebSocket("http://localhost:15674/ws"),
  //   });
  //   clientRef.current.onConnect = () => {
  //     // clientRef.current?.subscribe("/topic/signaling", (message) => {
  //     //   const data = JSON.parse(message.body);
  //     //   if (data.type === "offer") {
  //     //     const peer = new SimplePeer({
  //     //       initiator: false,
  //     //       trickle: false,
  //     //       stream: stream!,
  //     //     });
  //     //     peer.signal(data.offer);
  //     //     peer.on("signal", (answer) => {
  //     //       clientRef.current?.publish({
  //     //         destination: "/app/signal",
  //     //         body: JSON.stringify({ type: "answer", answer }),
  //     //       });
  //     //     });
  //     //     peer.on("stream", (stream) => {
  //     //       if (videoRef.current) {
  //     //         videoRef.current.srcObject = stream;
  //     //       }
  //     //     });
  //     //     setPeer(peer);
  //     //   } else if (data.type === "answer") {
  //     //     peer?.signal(data.answer);
  //     //   }
  //     // });
  //   };
  //   clientRef.current.activate();
  //   return () => {
  //     clientRef.current?.deactivate();
  //   };
  // }, []);

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  useEffect(() => {
    if (clientRef) {
      clientRef.subscribe(`/queue/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);
      });
    }
  }, [clientRef]);

  useEffect(() => {
    getPartnerData();
  }, [senderId, receiverId]);

  return (
    <>
      <div className="flex flex-col h-screen w-screen justify-between bg-[#1c1c1c] text-foreground relative">
        <div className="flex flex-col items-center justify-center h-full mb-4 space-y-3">
          {remoteVideoRef.current ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              className="absolute bottom-0 right-0 mb-5 mr-5 h-44 rounded-lg p-0"
            />
          ) : (
            <Avatar>
              <AvatarImage
                className="w-24 h-24"
                src={dataPartner?.avatarUrl}
              />
              <AvatarFallback className="w-24 h-24 bg-slate-200 flex text-black items-center justify-center">
                <p>{(dataPartner?.username)[0]}</p>
              </AvatarFallback>
            </Avatar>
          )}
          <h2 className="mt-2 text-2xl text-white font-bold">
            {dataPartner?.username}
          </h2>
          <p className="text-white">Calling...</p>
        </div>
        <div className="flex space-x-6 justify-center pb-8">
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
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            className="absolute bottom-0 right-0 mb-5 mr-5 h-44 rounded-lg p-0"
          />
        ) : (
          <>
            <div className="absolute bottom-0 right-0 mb-5 mr-5  rounded-lg p-0 bg-neutral-900 h-44 w-44 flex justify-center items-center shadow-lg">
              <Avatar>
                <AvatarImage
                  className="w-16 h-16"
                  src={currentUser?.avatarUrl}
                />
                <AvatarFallback className="w-16 h-16 bg-slate-200 flex text-black items-center justify-center">
                  <p>{currentUser?.username[0]}</p>
                </AvatarFallback>
              </Avatar>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VideoCall;
