import Loading from "@/components/shared/Loading";
import MeetingView from "@/components/shared/MeetingView";
import { getCurrentUser } from "@/services/UserService";
import { generateToken } from "@/services/VideoCallService";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Test: React.FC = () => {
  // const [meetingId, setMeetingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [meetingToken, setMeetingToken] = useState<string | null>(
    null
  );
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get("room");
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");

  const getMeetingAndToken = async () => {
    const response = await generateToken(
      JSON.parse(localStorage.getItem("info") || "0")
    );

    setMeetingToken(response?.data);

    // const meetingId =
    //   id == null
    //     ? await createMeeting({ token: response?.data })
    //     : id;
    // setMeetingId(meetingId);
  };

  const handleGetCurrentUser = async () => {
    const response = await getCurrentUser(
      JSON.parse(localStorage.getItem("info") || "0")
    );
    setCurrentUser(response?.data?.data);
  };

  const hanldeGetPartnerInfo = async () => {
    if (
      JSON.parse(localStorage.getItem("info") || "0") ===
      parseInt(senderId || "0")
    ) {
      const response = await getCurrentUser(
        parseInt(receiverId || "0")
      );
      if (response && response.data.data) {
        setPartnerInfo({
          ...response.data.data,
        });
      }
    } else {
      const response = await getCurrentUser(
        parseInt(senderId || "0")
      );
      if (response && response.data.data) {
        setPartnerInfo({
          ...response.data.data,
        });
      }
    }
  };

  const onMeetingLeave = () => {
    window.close();
    // setMeetingId(null);
  };

  useEffect(() => {
    getMeetingAndToken();
    hanldeGetPartnerInfo();
    handleGetCurrentUser();
    console.log("hanldeGetPartnerInfo");
    console.log("handleGetCurrentUser");
  }, [
    partnerInfo == null,
    currentUser == null,
    meetingToken == null,
  ]);

  return meetingToken && meetingId ? (
    <div className="bg-[#1c1c1c] h-screen w-screen">
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: "Kenny Will",
          debugMode: false,
        }}
        token={meetingToken}
      >
        {currentUser && (
          <MeetingView
            onMeetingLeave={onMeetingLeave}
            currentUser={currentUser}
            partnerInfo={partnerInfo}
          />
        )}
      </MeetingProvider>
    </div>
  ) : (
    <Loading />
  );
};

export default Test;
