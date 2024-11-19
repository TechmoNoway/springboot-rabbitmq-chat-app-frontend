import { useState } from "react";

interface JoinScreenProps {
  getMeetingAndToken: (meeting?: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({
  getMeetingAndToken,
}) => {
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const onClick = async () => {
    getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick} className="text-white">
        Join
      </button>
      {" or "}
      <button onClick={onClick} className="text-white">
        Create Meeting
      </button>
    </div>
  );
};

export default JoinScreen;
