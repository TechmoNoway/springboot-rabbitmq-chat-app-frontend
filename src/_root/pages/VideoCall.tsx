import AgoraUIKit from "agora-react-uikit";
import { useNavigate } from "react-router-dom";

const VideoCall = () => {
  const navigate = useNavigate();
  const rtcProps = {
    appId: "c7ae0b4958d14e9198a309f8d3e6a00b",
    channel: "main",
    token:
      "007eJxTYOBZt+fm4qLSuNqWpTbz6ntM/VPnPqvYvuzt1U8u2l+su0MVGAwMU5MSDdLSjBMNTEzMDCyTTC2NDS3MUy3MzNNSkg1M3llMSWsIZGRgev2SgREKQXwWhtzEzDwGBgDPvyFL",
  };
  const callbacks = {
    EndCall: () => navigate("/"),
  };
  return (
    <>
      <div
        style={{ display: "flex", width: "100vw", height: "100vh" }}
      >
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      </div>
    </>
  );
};

export default VideoCall;
