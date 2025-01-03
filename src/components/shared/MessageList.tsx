import moment from "moment";
import { IoClose } from "react-icons/io5";
import { Button } from "../ui/button";
import Loading from "./Loading";
import { IMessage, ISendMessage, IUser } from "@/types";
import { Ref } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Props = {
  currentMessage: Ref<HTMLDivElement>;
  allMessage: IMessage[];
  currentUser: IUser;
  dataPartner: IUser;
  message: ISendMessage;
  loading: boolean;
  handleClearUploadImage: () => void;
  handleSendImageMessage: () => void;
  handleClearUploadVideo: () => void;
  handleSendVideoMessage: () => void;
  handleDeleteMessage: (messageId: number) => void;
};

const youtubeRegex =
  /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;

const MessageList = ({
  currentMessage,
  allMessage,
  currentUser,
  dataPartner,
  message,
  loading,
  handleClearUploadImage,
  handleSendImageMessage,
  handleClearUploadVideo,
  handleSendVideoMessage,
  handleDeleteMessage,
}: Props) => {
  return (
    <>
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-30">
        {/**all message show here */}
        <div
          className="flex flex-col gap-7 py-2 mx-2 mt-5"
          ref={currentMessage}
        >
          {allMessage?.map((msg: IMessage, index: number) => {
            return (
              <div key={index}>
                <div className="flex items-start gap-2.5 mx-2">
                  {currentUser.id !== msg.senderId && (
                    <Avatar className="border-[1px] border-gray-300">
                      <AvatarImage
                        className="w-9 h-9"
                        src={dataPartner?.avatarUrl}
                      />
                      <AvatarFallback className="w-9 h-9 bg-slate-200 flex text-black items-center justify-center">
                        <p>{(dataPartner?.username)[0]}</p>
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={
                        "inline-flex self-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 ml-auto" +
                        `${
                          currentUser.id !== msg.senderId
                            ? " hidden"
                            : ""
                        }`
                      }
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                      >
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="font-semibold">
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold">
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold">
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-semibold"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div
                    className={
                      "flex flex-col gap-1 lg:max-w-[500px] max-w-64" +
                      `${
                        currentUser.id === msg.senderId
                          ? " pl-auto"
                          : ""
                      }`
                    }
                  >
                    <div
                      className={
                        "flex items-center space-x-2 rtl:space-x-reverse" +
                        `${
                          currentUser.id === msg.senderId
                            ? " justify-end"
                            : ""
                        }`
                      }
                    >
                      {currentUser.id === msg.senderId ? (
                        <>
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {moment(msg.timestamp).format("hh:mm")}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            You
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {dataPartner?.username}
                          </span>
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {moment(msg.timestamp).format("hh:mm")}
                          </span>
                        </>
                      )}
                    </div>

                    {msg.mediaType === "text" && (
                      <>
                        {msg.content.match(youtubeRegex) ? (
                          <div className="shadow-lg">
                            <div
                              className={
                                "flex flex-col leading-1.5 p-4 border-gray-200 min-w-14 rounded-t-lg" +
                                `${
                                  currentUser.id === msg.senderId
                                    ? " bg-blue-300"
                                    : " bg-white dark:bg-gray-700"
                                }`
                              }
                            >
                              <a
                                href={msg.content}
                                className="text-sm font-semibold py-2.5 text-gray-900 dark:text-white justify-end underline"
                              >
                                {msg.content}
                              </a>
                            </div>

                            <iframe
                              className="object-scale-down rounded-b-lg lg:w-[500px] lg:h-[300px]"
                              src={`https://www.youtube.com/embed/${
                                msg.content
                                  .split("v=")[1]
                                  .split("&")[0]
                              }`}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div
                            className={
                              "flex flex-col leading-1.5 p-4 border-gray-200" +
                              `${
                                currentUser.id === msg.senderId
                                  ? " bg-blue-300 rounded-s-xl rounded-ee-xl"
                                  : " bg-white dark:bg-gray-700 rounded-e-xl rounded-es-xl"
                              }`
                            }
                          >
                            <p className="text-sm font-normal text-gray-900 dark:text-white">
                              {msg.content}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {msg?.mediaUrl && msg?.mediaType == "image" && (
                      <div
                        className={
                          "flex flex-col w-full max-w-64 sm:max-w-96 lg:max-w-[500px] leading-1.5 shadow-lg" +
                          `${
                            currentUser.id === msg.senderId
                              ? " ml-auto"
                              : ""
                          }`
                        }
                      >
                        <Dialog>
                          <DialogTrigger>
                            <img
                              src={msg?.mediaUrl}
                              className={
                                "lg:max-w-[500px] object-scale-down rounded-lg shadow-lg"
                              }
                            />
                          </DialogTrigger>
                          <DialogContent className="p-0 w-[1000px]">
                            <img
                              src={msg?.mediaUrl}
                              className={
                                "w-[900px] max-w-full rounded-lg border-none"
                              }
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {msg?.mediaUrl && msg?.mediaType == "video" && (
                      <video
                        src={msg.mediaUrl}
                        className="lg:max-w-[500px] object-scale-down rounded-lg shadow-lg"
                        controls
                      />
                    )}

                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Delivered
                    </span>
                  </div>

                  {/* <DropdownMenu>
                    <DropdownMenuTrigger
                      className={
                        "inline-flex self-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" +
                        `${
                          currentUser.id !== msg.senderId
                            ? ""
                            : " hidden"
                        }`
                      }
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                      >
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="font-semibold">
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold">
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold">
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </div>
            );
          })}
        </div>

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-gray-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-transparent flex flex-col">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
              />
              <div className="flex justify-end mt-3">
                <Button onClick={handleSendImageMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-transparent flex flex-col">
              <video
                src={message.videoUrl}
                className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
                controls
                muted
                autoPlay
              />
              <div className="flex justify-end mt-3">
                <Button onClick={handleSendVideoMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>
    </>
  );
};

export default MessageList;
