import MessageList from "@/components/shared/MessageList";
import { RightSidebar } from "@/components/shared/RightSidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import uploadFile from "@/components/utils/uploadFile";
import { useWebSocket } from "@/context/WebSocketContext";
import { setUser } from "@/redux/authSlice";
import {
  addFriend,
  checkIsFriend,
  removeFriend,
} from "@/services/FriendService";
import {
  deleteMessage,
  getMessagesBetweenTwoUsers,
  saveMessage,
} from "@/services/MessageService";
import {
  getCurrentUser,
  getUserStatus,
} from "@/services/UserService";
import { IMessage } from "@/types";
import EmojiPicker from "emoji-picker-react";
import { PanelLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function MessagePage() {
  const params = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.auth);
  const stompClient = useWebSocket();

  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [dataPartner, setDataPartner] = useState({
    id: 0,
    username: "",
    email: "",
    avatarUrl: "",
    isActive: false,
    birthdate: "",
    phoneNumber: "",
    status: "offline",
    isBlocked: false,
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [allMessage, setAllMessage] = useState<IMessage[]>([]);
  const currentMessage = useRef<HTMLDivElement>(null);

  const getAllMessages = async () => {
    const currentUserResponse = await getCurrentUser(
      JSON.parse(localStorage.getItem("info") || "0")
    );
    const currentUserData = currentUserResponse?.data.data;
    dispatch(setUser(currentUserData));

    const response = await getMessagesBetweenTwoUsers(
      currentUserData.id,
      parseInt(params.userId || "0")
    );

    if (response && response.data.data) {
      setAllMessage(response.data.data);
    }
  };

  const getPartnerData = async () => {
    const response = await getCurrentUser(
      parseInt(params.userId || "0")
    );

    if (response && response.data.data) {
      const currentPartnerStatus = await getUserStatus(
        response.data.data.id
      );
      setDataPartner({
        ...response.data.data,
        status: currentPartnerStatus?.data.data || "offline",
      });
    }
  };

  const handleOutputEmoji = (e: any) => {
    setMessage((prev) => {
      return { ...prev, text: prev.text + e.emoji };
    });
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setLoading(false);

      setMessage((preve) => {
        return {
          ...preve,
          imageUrl: uploadPhoto.url,
        };
      });
    }
  };

  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setLoading(false);
      setMessage((preve) => {
        return {
          ...preve,
          videoUrl: uploadPhoto.url,
        };
      });
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e: {
    target: { name: any; value: any };
  }) => {
    const { value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (message.text !== "" && message.text.trim() !== "") {
      if (stompClient && stompClient.connected) {
        let newMessage = {
          senderId: currentUser.id,
          receiverId: dataPartner.id,
          content: message.text,
          status: "",
          mediaType: "text",
          mediaUrl: "",
          timestamp: new Date(),
        };
        stompClient.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
            type: "message",
          }),
        });
        setAllMessage((prev: any) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);
        await saveMessage(newMessage);
        getAllMessages();
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  const handleSendImageMessage = async () => {
    if (message.imageUrl !== "") {
      if (stompClient && stompClient.connected) {
        let newMessage = {
          senderId: currentUser.id,
          receiverId: dataPartner.id,
          content: "",
          status: "",
          mediaType: "image",
          mediaUrl: message.imageUrl,
          timestamp: new Date(),
        };
        stompClient.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
          }),
        });

        setAllMessage((prev: any) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);

        const saveMessageResponse = await saveMessage(newMessage);
        console.log(saveMessageResponse);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  const handleSendVideoMessage = async () => {
    if (message.videoUrl !== "") {
      if (stompClient && stompClient.connected) {
        let newMessage = {
          senderId: currentUser.id,
          receiverId: dataPartner.id,
          content: "",
          status: "",
          mediaType: "video",
          mediaUrl: message.videoUrl,
          timestamp: new Date(),
        };
        stompClient.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
          }),
        });
        setAllMessage((prev: any) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);
        const saveMessageResponse = await saveMessage(newMessage);
        console.log(saveMessageResponse);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const response = await deleteMessage(id);
    if (response?.status === 200) {
      setAllMessage((prev) =>
        prev.filter((message) => message.id !== id)
      );
    }
  };

  useEffect(() => {
    getAllMessages();
    getPartnerData();
  }, [params]);

  useEffect(() => {
    const intervalStatus = setInterval(async () => {
      getPartnerData();
    }, 20000);

    return () => clearInterval(intervalStatus);
  }, [currentUser.id, params]);

  useEffect(() => {
    if (stompClient?.connected) {
      console.log("stomp client is connected");
      const subscription = stompClient.subscribe(
        `/topic/${currentUser.username}`,
        (message: { body: string }) => {
          console.log(message);

          if (message.body) {
            const newMessage = JSON.parse(message.body);

            setAllMessage((prev) => [
              ...prev,
              {
                ...newMessage,
                timestamp: new Date(
                  newMessage.timestamp
                ).toISOString(),
              },
            ]);
          } else {
            console.log("got empty message");
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient?.connected, currentUser?.username]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleCheckUserIsFriend = async () => {
    const response = await checkIsFriend(
      currentUser.id,
      dataPartner.id
    );
    if (response?.status === 200) {
      setIsFriend(response?.data.data);
    }
  };

  const handleAddFriend = async () => {
    const response = await addFriend(currentUser.id, dataPartner.id);
    console.log(response);
    if (response?.status === 200) {
      setIsFriend(true);
    }
  };

  const handleRemoveFriend = async () => {
    const response = await removeFriend(
      currentUser.id,
      dataPartner.id
    );
    console.log(response);
    if (response?.status === 200) {
      setIsFriend(false);
    }
  };

  useEffect(() => {
    handleCheckUserIsFriend();
  }, [dataPartner, currentUser?.username]);

  return (
    <>
      <SidebarProvider defaultOpen={false} open={isRightSidebarOpen}>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-4">
              <Link to={"/"} className="lg:hidden">
                <FaAngleLeft size={25} />
              </Link>
              <div className="relative">
                <Button
                  className="w-12 h-12 rounded-full bg-transparent hover:bg-transparent"
                  onClick={() =>
                    setIsRightSidebarOpen(!isRightSidebarOpen)
                  }
                >
                  <Avatar>
                    <AvatarImage
                      className="w-12 h-12"
                      src={dataPartner?.avatarUrl}
                    />
                    <AvatarFallback className="w-12 h-12 bg-slate-200 flex text-black items-center justify-center">
                      <p>{(dataPartner?.username)[0]}</p>
                    </AvatarFallback>
                  </Avatar>
                </Button>
                {dataPartner?.status === "online" && (
                  <div className="absolute bg-green-600 p-[6px] bottom-1 -right-[2px] z-10 rounded-full"></div>
                )}
                {dataPartner?.status === "away" && (
                  <div className="absolute bg-yellow-500 p-[6px] bottom-1 -right-[2px] z-10 rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg -my-1">
                  {dataPartner?.username}
                </h3>
                <p className="-my-1 text-sm font-semibold">
                  {dataPartner.status == "online" && (
                    <span className="text-green-500">online</span>
                  )}
                  {dataPartner.status == "away" && (
                    <span className="text-yellow-600">away</span>
                  )}
                  {dataPartner.status == "offline" && (
                    <span className="text-slate-400">offline</span>
                  )}
                </p>
              </div>
            </div>

            <Button
              className="ml-auto"
              variant="ghost"
              onClick={() =>
                setIsRightSidebarOpen(!isRightSidebarOpen)
              }
            >
              <PanelLeft className="w-6 h-6" />
            </Button>
          </header>
          <div className="flex flex-1 flex-col">
            <MessageList
              currentMessage={currentMessage}
              allMessage={allMessage}
              currentUser={currentUser}
              dataPartner={dataPartner}
              message={message}
              loading={loading}
              handleClearUploadImage={handleClearUploadImage}
              handleSendImageMessage={handleSendImageMessage}
              handleClearUploadVideo={handleClearUploadVideo}
              handleSendVideoMessage={handleSendVideoMessage}
              handleDeleteMessage={handleDeleteMessage}
            />

            {/**send message */}
            {message.imageUrl == "" && message.videoUrl == "" ? (
              <section className="h-16 bg-white flex items-center px-2 space-x-2">
                {/**video and image */}
                <Popover>
                  <PopoverTrigger className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white">
                    <FaPlus size={16} />
                  </PopoverTrigger>
                  <PopoverContent className="bg-white shadow rounded bottom-14 w-36 p-2 ml-24">
                    <form>
                      <label
                        htmlFor="uploadImage"
                        className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                      >
                        <div className="text-primary">
                          <FaImage size={18} />
                        </div>
                        <p>Image</p>
                      </label>
                      <label
                        htmlFor="uploadVideo"
                        className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                      >
                        <div className="text-purple-500">
                          <FaVideo size={18} />
                        </div>
                        <p>Video</p>
                      </label>

                      <input
                        type="file"
                        id="uploadImage"
                        onChange={handleUploadImage}
                        className="hidden"
                      />

                      <input
                        type="file"
                        id="uploadVideo"
                        onChange={handleUploadVideo}
                        className="hidden"
                      />
                    </form>
                  </PopoverContent>
                </Popover>

                {/**input box */}
                <form
                  className="h-full w-full flex gap-2 py-2"
                  onSubmit={handleSendMessage}
                >
                  <div className="w-full h-full flex rounded-full bg-gray-100 items-center justify-between py-1 pl-4 pr-3">
                    <input
                      type="text"
                      placeholder="Type here message..."
                      className="outline-none w-full h-full bg-transparent"
                      value={message.text}
                      onChange={handleOnChange}
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="bg-transparent hover:bg-slate-200 rounded-full p-2 cursor-pointer">
                          <BsEmojiSmileFill className="w-6 h-6" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[299px] h-[399px] p-0 bg-transparent border-0"
                        align="end"
                      >
                        <EmojiPicker
                          width={300}
                          height={400}
                          className="border-0 rounded-none"
                          onEmojiClick={handleOutputEmoji}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <button className="text-primary hover:text-secondary">
                    <IoMdSend size={28} />
                  </button>
                </form>
              </section>
            ) : (
              <></>
            )}
          </div>
        </SidebarInset>
        <RightSidebar
          side="right"
          partnerData={dataPartner}
          isFriend={isFriend}
          handleAddFriend={handleAddFriend}
          handleRemoveFriend={handleRemoveFriend}
          className="shadow-xl"
        />
      </SidebarProvider>
    </>
  );
}
