import moment from "moment";
import { IoClose } from "react-icons/io5";
import { Button } from "../ui/button";
import Loading from "./Loading";
import { IMessage, ISendMessage, IUser } from "@/types";
import { Ref } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
}: Props) => {
  return (
    <>
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <div
          className="flex flex-col gap-2 py-2 mx-2"
          ref={currentMessage}
        >
          {allMessage?.map((msg: IMessage, index: number) => {
            return (
              <div key={index}>
                <div>
                  {msg.mediaType === "text" && (
                    <div className="flex items-start gap-2.5">
                      {currentUser.id !== msg.senderId && (
                        <Avatar>
                          <AvatarImage
                            className="w-8 h-8"
                            src={dataPartner?.avatarUrl}
                          />
                          <AvatarFallback className="w-8 h-8 bg-slate-200 flex text-black items-center justify-center">
                            <p>{(dataPartner?.username)[0]}</p>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={
                          "flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200   dark:bg-gray-700" +
                          `${
                            currentUser.id === msg.senderId
                              ? " ml-auto bg-blue-300 rounded-xl"
                              : " bg-white rounded-e-xl rounded-es-xl"
                          }`
                        }
                      >
                        <div
                          className={
                            "flex items-center space-x-2 " +
                            `${
                              currentUser.id === msg.senderId
                                ? "justify-end"
                                : ""
                            }`
                          }
                        >
                          {currentUser.id === msg.senderId ? (
                            <>
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                {moment(msg.timestamp).format(
                                  "hh:mm"
                                )}
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
                                {moment(msg.timestamp).format(
                                  "hh:mm"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className={
                            "flex flex-col" +
                            `${
                              currentUser.id === msg.senderId
                                ? " items-end"
                                : ""
                            }`
                          }
                        >
                          <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white justify-end">
                            {msg.content}
                          </p>
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            Delivered
                          </span>
                        </div>
                      </div>
                      <button
                        id={`dropdownMenuIconButton${index}`}
                        data-dropdown-toggle={`dropdownDots${index}`}
                        data-dropdown-placement="bottom-start"
                        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                        type="button"
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
                      </button>
                      <div
                        id={`dropdownDots${index}`}
                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul
                          className="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby={`dropdownMenuIconButton${index}`}
                        >
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Reply
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Forward
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Copy
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Report
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {msg?.mediaUrl && msg?.mediaType == "image" && (
                    <img
                      src={msg?.mediaUrl}
                      className="w-full h-full object-scale-down rounded-lg shadow-md"
                    />
                  )}
                  {msg?.mediaUrl && msg?.mediaType == "video" && (
                    <video
                      src={msg.mediaUrl}
                      className="w-full h-full object-scale-down rounded-lg shadow-md"
                      controls
                    />
                  )}
                </div>
                {/* {msg?.mediaType == "text" ? (
                  youtubeRegex.test(msg.content) ? (
                    <iframe
                      className="object-scale-down rounded-lg shadow-md lg:w-[440px] lg:h-[245px]"
                      src={`https://www.youtube.com/embed/${
                        msg.content.split("v=")[1].split("&")[0]
                      }`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p className="px-2">{msg.content}</p>
                  )
                ) : (
                  <p className="px-2">{msg.content}</p>
                )} */}
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