// import React from 'react'

// export const test = () => {
//   return (
//     <div>
//       <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
//         {/**all message show here */}
//         <div
//           className="flex flex-col gap-2 py-2 mx-2"
//           ref={currentMessage}
//         >
//           {allMessage?.map((msg, index) => {
//             const generateClassName = () => {
//               let classes =
//                 "p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md break-words";
//               if (
//                 msg.mediaType !== "text" ||
//                 youtubeRegex.test(msg.content)
//               )
//                 classes += " bg-transparent";
//               if (
//                 currentUser.id === msg?.receiverId &&
//                 msg.mediaType === "text"
//               )
//                 classes += " bg-white";
//               if (currentUser.id === msg.senderId) {
//                 if (msg.mediaType === "text")
//                   classes += " bg-blue-300";
//                 classes += " ml-auto";
//               }
//               return classes;
//             };

//             return (
//               <div className={generateClassName()} key={index}>
//                 <div className="w-full relative">
//                   {msg?.mediaUrl && msg?.mediaType == "image" && (
//                     <img
//                       src={msg?.mediaUrl}
//                       className="w-full h-full object-scale-down rounded-lg shadow-md"
//                     />
//                   )}
//                   {msg?.mediaUrl && msg?.mediaType == "video" && (
//                     <video
//                       src={msg.mediaUrl}
//                       className="w-full h-full object-scale-down rounded-lg shadow-md"
//                       controls
//                     />
//                   )}
//                 </div>
//                 {msg?.mediaType == "text" ? (
//                   youtubeRegex.test(msg.content) ? (
//                     <iframe
//                       className="object-scale-down rounded-lg shadow-md lg:w-[440px] lg:h-[245px]"
//                       src={`https://www.youtube.com/embed/${
//                         msg.content.split("v=")[1].split("&")[0]
//                       }`}
//                       title="YouTube video player"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                       referrerPolicy="strict-origin-when-cross-origin"
//                       allowFullScreen
//                     ></iframe>
//                   ) : (
//                     <p className="px-2">{msg.content}</p>
//                   )
//                 ) : (
//                   <p className="px-2">{msg.content}</p>
//                 )}

//                 <p className="text-xs px-2 py-2 w-fit">
//                   {moment(msg.timestamp).format("hh:mm")}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/**upload Image display */}
//         {message.imageUrl && (
//           <div className="w-full h-full sticky bottom-0 bg-gray-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
//             <div
//               className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
//               onClick={handleClearUploadImage}
//             >
//               <IoClose size={30} />
//             </div>
//             <div className="bg-transparent flex flex-col">
//               <img
//                 src={message.imageUrl}
//                 alt="uploadImage"
//                 className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
//               />
//               <div className="flex justify-end mt-3">
//                 <Button onClick={handleSendImageMessage}>Send</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/**upload video display */}
//         {message.videoUrl && (
//           <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
//             <div
//               className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
//               onClick={handleClearUploadVideo}
//             >
//               <IoClose size={30} />
//             </div>
//             <div className="bg-transparent flex flex-col">
//               <video
//                 src={message.videoUrl}
//                 className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
//                 controls
//                 muted
//                 autoPlay
//               />
//               <div className="flex justify-end mt-3">
//                 <Button onClick={handleSendVideoMessage}>Send</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
//             <Loading />
//           </div>
//         )}
//       </section>
//       ;
//     </div>
//   );
// }
