import { Button } from "@/components/ui/button";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SimplePeer, { SignalData } from "simple-peer";
interface SignalingData {
  type: string;
  offer?: SimplePeer.SignalData;
  answer?: SimplePeer.SignalData;
}

const VideoCall: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<Client | null>(null);

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
      webSocketFactory: () =>
        new WebSocket("ws://localhost:15674/ws"),
    });

    clientRef.current.onConnect = () => {
      clientRef.current?.subscribe("/topic/signaling", (message) => {
        const data: SignalingData = JSON.parse(message.body);
        if (data.type === "offer" && stream) {
          const newPeer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
          });
          newPeer.signal(data.offer as SignalData);
          newPeer.on("signal", (answer) => {
            clientRef.current?.publish({
              destination: "/app/signal",
              body: JSON.stringify({ type: "answer", answer }),
            });
          });
          newPeer.on("stream", (remoteStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          });
          setPeer(newPeer);
        } else if (data.type === "answer" && peer) {
          peer.signal(data.answer as SignalData);
        }
      });
    };

    clientRef.current.activate();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
        // Optionally, display a user-friendly message
        alert(
          "Permission to access camera and microphone was denied."
        );
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const callUser = () => {
    if (stream) {
      const newPeer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
      });
      newPeer.on("signal", (offer) => {
        clientRef.current?.publish({
          destination: "/app/signal",
          body: JSON.stringify({ type: "offer", offer }),
        });
      });
      newPeer.on("stream", (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
      });
      setPeer(newPeer);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <Button onClick={callUser}>Call</Button>
    </div>
  );
};

export default VideoCall;
