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
import { getCurrentUser } from "@/services/UserService";
import { Client } from "@stomp/stompjs";
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
import { FcEndCall } from "react-icons/fc";
import { FiMic, FiMicOff } from "react-icons/fi";
import { useParams } from "react-router-dom";
import SimplePeer from "simple-peer";

const VideoCall: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<Client | null>(null);
  const params = useParams();

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
    const response = await getCurrentUser(
      parseInt(params.userId || "0")
    );

    if (response && response.data.data) {
      setDataPartner({
        ...response.data.data,
      });
    }
  };

  const handleToggleTurnOnScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleToggleTurnOnCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.log("Error accessing camera:", error);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        console.log("Camera is off");
        const tracks = (
          videoRef.current.srcObject as MediaStream
        ).getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOn]);

  // TODO: Fix the issue with the camera
  useEffect(() => {
    clientRef.current = new Client({
      brokerURL: "ws://localhost:15674/ws",
      connectHeaders: {
        login: "guest",
        passcode: "guest",
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () =>
        new WebSocket("http://localhost:15674/ws"),
    });

    // clientRef.current.onConnect = () => {
    //   clientRef.current?.subscribe("/topic/signaling", (message) => {
    //     const data = JSON.parse(message.body);
    //     if (data.type === "offer") {
    //       const peer = new SimplePeer({
    //         initiator: false,
    //         trickle: false,
    //         stream: stream!,
    //       });
    //       peer.signal(data.offer);
    //       peer.on("signal", (answer) => {
    //         clientRef.current?.publish({
    //           destination: "/app/signal",
    //           body: JSON.stringify({ type: "answer", answer }),
    //         });
    //       });
    //       peer.on("stream", (stream) => {
    //         if (videoRef.current) {
    //           videoRef.current.srcObject = stream;
    //         }
    //       });
    //       setPeer(peer);
    //     } else if (data.type === "answer") {
    //       peer?.signal(data.answer);
    //     }
    //   });
    // };

    // clientRef.current.activate();

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     setStream(stream);
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   });

    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  useEffect(() => {
    getPartnerData();
  }, [params]);

  // const callUser = () => {
  //   const peer = new SimplePeer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream!,
  //   });

  //   peer.on("signal", (offer) => {
  //     clientRef.current?.publish({
  //       destination: "/app/signal",
  //       body: JSON.stringify({ type: "offer", offer }),
  //     });
  //   });
  //   peer.on("stream", (stream) => {
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //     }
  //   });
  //   setPeer(peer);
  // };

  return (
    <>
      {/* <video ref={videoRef} autoPlay /> */}
      {/* <button onClick={callUser}>Call</button> */}
      <div className="flex flex-col h-screen w-screen justify-between bg-black text-foreground relative">
        <div className="flex flex-col items-center justify-center h-full mb-4 space-y-3">
          <Avatar>
            <AvatarImage
              className="w-24 h-24"
              src={dataPartner?.avatarUrl}
            />
            <AvatarFallback className="w-12 h-12 bg-slate-200 flex text-black items-center justify-center">
              <p>{(dataPartner?.username)[0]}</p>
            </AvatarFallback>
          </Avatar>
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
                <Button className="w-12 h-12 rounded-full bg-neutral-600">
                  <FiMic className="w-8 h-8" />
                  {/* <FiMicOff /> */}
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
                <Button className="bg-destructive w-12 h-12 rounded-full">
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
        <video
          ref={videoRef}
          autoPlay
          className="absolute bottom-0 right-0 mb-5 mr-5 h-48 rounded-lg p-0"
        />
      </div>
    </>
  );
};

export default VideoCall;
