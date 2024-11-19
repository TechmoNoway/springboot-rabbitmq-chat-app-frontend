import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface ParticipantViewProps {
  participantId: string;
  className?: string;
  currentUser: any;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({
  participantId,
  className,
  currentUser,
}) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId);

  // const videoStream = useMemo(() => {
  //   if (webcamOn && webcamStream) {
  //     const mediaStream = new MediaStream();
  //     mediaStream.addTrack(webcamStream.track);
  //     return mediaStream;
  //   }
  // }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn && webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        webcamRef.current.srcObject = mediaStream;
        webcamRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        webcamRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={participantId}>
      <audio ref={micRef} autoPlay muted={micOn} />
      {webcamOn ? (
        // <ReactPlayer
        //   playsinline
        //   pip={false}
        //   light={false}
        //   controls={false}
        //   muted={true}
        //   playing={true}
        //   url={videoStream}
        //   height={"200px"}
        //   width={"300px"}
        //   onError={(err) => {
        //     console.log(err, "participant video error");
        //   }}
        // />
        <video
          playsInline
          muted={true}
          ref={webcamRef}
          autoPlay
          className={className}
        />
      ) : (
        <>
          {/* absolute bottom-4 right-0 mb-8 mr-5 rounded-lg p-0
          bg-neutral-900 h-44 w-44 flex justify-center items-center
          shadow-lg */}
          <div className={className}>
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
  );
};

export default ParticipantView;
