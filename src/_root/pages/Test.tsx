import React, { useState } from "react";
import axios from "axios";

export const sendMessage = (message: string, queueName: string) => {
  return axios.post(`http://localhost:8081/api/v1/send`, null, {
    params: { message, queueName },
  });
};

export const createQueue = (queueName: string) => {
  return axios.post(
    `http://localhost:8081/api/v1/createQueue`,
    null,
    {
      params: { queueName },
    }
  );
};

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState("");
  const [queueName, setQueueName] = useState("");

  const handleSendMessage = () => {
    sendMessage(message, queueName).then(() => {
      setMessage("");
    });
  };

  const handleCreateQueue = () => {
    createQueue(queueName);
  };

  return (
    <div>
      <input
        type="text"
        value={queueName}
        onChange={(e) => setQueueName(e.target.value)}
        placeholder="Queue Name"
      />
      <button onClick={handleCreateQueue}>Create Queue</button>
      <br />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default ChatRoom;
