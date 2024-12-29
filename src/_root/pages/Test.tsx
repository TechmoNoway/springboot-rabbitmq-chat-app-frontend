import Divider from "@/components/shared/Divider";
import { RightSidebar } from "@/components/shared/RightSidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
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
  getMessagesBetweenTwoUsers,
  saveMessage,
} from "@/services/MessageService";
import {
  getCurrentUser,
  getUserStatus,
} from "@/services/UserService";
import { IMessage } from "@/types";
import { useEffect, useRef, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoAddCircle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function Test() {
  const params = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.auth);
  const stompClient = useWebSocket();

  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

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
      currentUser.id
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
      <SidebarProvider className="">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-4">
              <Link to={"/"} className="lg:hidden">
                <FaAngleLeft size={25} />
              </Link>
              <div className="relative">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-12 h-12 rounded-full bg-transparent hover:bg-transparent">
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
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Account Info</DialogTitle>
                    </DialogHeader>
                    <Divider />
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            className="w-28 h-28 rounded-full shadow-md"
                            src={dataPartner?.avatarUrl}
                          />

                          <AvatarFallback className="w-28 h-28 rounded-full shadow-md bg-slate-200 flex items-center justify-center">
                            <p className="text-black text-2xl">
                              {(dataPartner?.username)[0]}
                            </p>
                          </AvatarFallback>
                        </Avatar>
                        {dataPartner?.status === "online" && (
                          <div className="absolute bg-green-600 p-[8px] bottom-2 -right-[-6px] z-10 rounded-full"></div>
                        )}
                        {dataPartner?.status === "away" && (
                          <div className="absolute bg-yellow-500 p-[8px] bottom-2 -right-[-6px] z-10 rounded-full"></div>
                        )}
                      </div>
                      <div className="font-semibold text-xl">
                        {dataPartner?.username}
                      </div>
                    </div>

                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        {isFriend ? (
                          <Button
                            className="col-span-1 bg-blue-200 hover:bg-blue-300  text-black space-x-1"
                            onClick={handleRemoveFriend}
                          >
                            <BsPersonFillCheck className="w-4 h-4" />
                            <p>Is friend</p>
                          </Button>
                        ) : (
                          <Button
                            className="col-span-1 bg-gray-200 hover:bg-gray-300 text-black space-x-1"
                            onClick={handleAddFriend}
                          >
                            <IoAddCircle className="w-5 h-5" />
                            <p> Add friend</p>
                          </Button>
                        )}
                        <Button className="col-span-1 bg-gray-200 hover:bg-gray-300 text-black">
                          <Link
                            to={`/${dataPartner?.id}`}
                            className="w-full h-full"
                          >
                            Text
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid gap-4 pb-2">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label htmlFor="username">Email</Label>
                        <div className="col-span-1">
                          {dataPartner?.email}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label htmlFor="birthdate">Birthdate</Label>
                        <div className="col-span-1">
                          {dataPartner?.birthdate || "../../...."}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <Label htmlFor="phoneNumber">
                          Phone Number
                        </Label>
                        <div className="col-span-1">
                          {dataPartner?.phoneNumber || ".........."}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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

            <div className="space-x-3">
              <button className="cursor-pointer hover:text-primary">
                <HiDotsVertical className="w-4 h-4" />
              </button>
            </div>
            <SidebarTrigger className="ml-auto" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
        <RightSidebar side="right" />
      </SidebarProvider>
    </>
  );
}
