import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef } from "react";
import ReactPlayer from "react-player";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface ParticipantViewProps {
  participantId: string;
  className?: string;
  currentUser: any;
  partnerInfo: any;
  index: number;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({
  participantId,
  currentUser,
  partnerInfo,
  index,
}) => {
  console.log(participantId);

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
    <div
      key={participantId}
      className="flex items-center justify-center"
    >
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
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
          className={
            index === 0
              ? "absolute bottom-0 right-0 mb-5 mr-5 h-44 rounded-lg p-0"
              : "mb-4 rounded-lg w-[1000px]"
          }
        />
      ) : (
        <>
          {/* absolute bottom-4 right-0 mb-8 mr-5 rounded-lg p-0
          bg-neutral-900 h-44 w-44 flex justify-center items-center
          shadow-lg */}
          <div
            className={
              index === 0
                ? "absolute flex items-center justify-center bottom-0 right-0 mb-5 mr-5 h-44 rounded-lg px-20 shadow-xl bg-opacity-10 bg-[#292929]"
                : "mb-4 space-y-3"
            }
          >
            <Avatar>
              <AvatarImage
                className="w-16 h-16"
                src={
                  index === 0
                    ? currentUser?.avatarUrl
                    : partnerInfo?.avatarUrl
                }
              />
              <AvatarFallback className="w-16 h-16 bg-slate-200 flex text-black items-center justify-center">
                <p>
                  {index === 0
                    ? currentUser?.username[0]
                    : partnerInfo?.username[0]}
                </p>
              </AvatarFallback>
            </Avatar>
          </div>
        </>
      )}
    </div>
  );
};

export default ParticipantView;
