import React, { useEffect, useRef, useState } from "react";
import RevisionComment from "./components/RevisionComment";
import SubmitMessage from "./components/SubmitMessage";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { File, X } from "lucide-react";
import getRevisionDetails from "./api/getRevisionDetails";
import { useAdminContext } from "../../../Context/AdminContext";
import NoMessagesIcon from "./components/NoMessagesIcon";
import instance from "../../../axios/instance";
import MessagesDiv from "./components/MessagesDiv";

const RevisionsDetails = () => {
  const [loading, setLoading] = useState(true);
  const [revisionMessages, setRevisionMessages] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const messageEndRef = useRef(null);
  const messageRef = useRef(null);
  const unReadMessagesRef = useRef(null);
  const { id } = useParams();
  const { setWorkBeingRevised, setShowNavBar } = useAdminContext();
  const [unReadMessages, setUnReadMessages] = useState(0);

  const markMessagesAsRead = async () => {
    try {
      const response = await instance.post(
        `/revisions/${id}/mark-messages-as-read/`
      );
      setUnReadMessages(0);
    } catch (error) {
      if (error.response && error.response.status) {
        const status = error.response.status;
        const message = error.response.data.error;

        switch (status) {
          case 500:
            toast.error(`Internal server error`);
            break;
          default:
            toast.error(`Error: ${message}`);
            break;
        }
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (!deleting) {
      if (unReadMessages > 0) {
        unReadMessagesRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        if (revisionMessages.length > 0) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [revisionMessages]);

  useEffect(() => {
    setLoading(true);
    setShowNavBar(false);
    getRevisionDetails(id).then((data) => {
      setWorkBeingRevised(data.work);
      setRevisionMessages(data.messages);
      // console.log(data.messages);

      const unReadMsgs = data.messages.filter(
        (item) => item.is_read == false && item.is_mine == false
      ).length;
      setUnReadMessages(unReadMsgs);
      // console.log(data);
      setLoading(false);
    });

    const timer = setTimeout(() => {
      markMessagesAsRead();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {

  //   // const timer = setTimeout(() => {
  //   //   markMessagesAsRead();
  //   // }, 2000);

  //   // return () => clearTimeout(timer);
  // }, []);

  // conn

  return (
    // <CarouselComponent images={[logo]} />
    <div
      className="w-full h-[calc(100vh-6rem)] relative px-4 md:px-[2rem]
       flex flex-col justify-between bg-purple-50
     dark:bg-darkMode-bars dark:text-black md:gap-0 overflow-hidden"
    >
      <div className="relative h-[88%] overflow-hidden">
        <div
          className={` remove-scrollbar h-full w-full pt-2 ${
            file === null && image === null
              ? "overflow-y-scroll"
              : "overflow-hidden"
          } `}
        >
          {/* shown when no messages are available */}
          <NoMessagesIcon
            revisionMessages={revisionMessages}
            loading={loading}
          />

          <div ref={messageRef}></div>
          <MessagesDiv
            revisionMessages={revisionMessages}
            setRevisionMessages={setRevisionMessages}
            setDeleting={setDeleting}
            markMessagesAsRead={markMessagesAsRead}
          />
          <div
            ref={unReadMessagesRef}
            className={`${
              unReadMessages > 0 ? "" : "hidden"
            } flex justify-center bg-gray-100 mb-8 py-2 `}
          >
            <h1
              className={`uppercase font-semibold text-center bg-green-200 py-2 px-4 rounded-3xl ${
                unReadMessages > 0 ? "" : "hidden"
              }`}
            >
              {" "}
              {unReadMessages} Unread messages
            </h1>
          </div>
          {revisionMessages &&
            revisionMessages.map((message, index) => {
              if (!message?.is_mine && !message?.is_read)
                return (
                  <RevisionComment
                    key={index}
                    {...message}
                    revisionMessages={revisionMessages}
                    setRevisionMessages={setRevisionMessages}
                    setDeleting={setDeleting}
                    markMessagesAsRead={markMessagesAsRead}
                  />
                );
            })}

          <div ref={messageEndRef} className="mt-4"></div>
        </div>

        {/* section that pops after UPLOADING a file or image to send ___________________________________________________ */}
        <div
          className={`${
            file === null && image === null ? "hidden" : ""
          } bg-[#F0F0F0] h-full top-0 bottom-0 absolute right-0
       left-0 z-[100]`}
        >
          <div className="flex items-center py-3 relative">
            {/* cancel button */}
            <button
              onClick={() => {
                setImage(null);
                setFile(null);
              }}
              className="rounded-full  p-2
             absolute left-0 top-1/2 -translate-y-1/2 text-gray-600"
            >
              <X size={22} strokeWidth={2} />
            </button>
            <p className="text-center text-[15px] w-full">
              {file && file.name}
              {image && image.name}
            </p>
          </div>
          <div className="w-full h-full flex items-center">
            {/* image viewer */}
            <div
              className={`${
                image == null ? "hidden" : ""
              } w-[92%] md:w-[40%] mx-auto h-[20rem] bg-gray-200 flex items-center
           justify-between flex-col rounded-xl`}
            >
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  className="w-full h-full "
                  alt="Preview"
                />
              )}
            </div>
            {/* file viewer */}
            <div
              className={`${
                file == null ? "hidden" : ""
              } w-[91%] md:w-[40%] mx-auto h-[18rem] bg-gray-200 flex items-center
           justify-between flex-col py-14 gap-2 rounded-xl`}
            >
              <File
                size={130}
                strokeWidth={0.1}
                className="text-gray-400"
                fill="white"
              />
              <div className="flex flex-col items-center">
                <p className="text-gray-400 font-medium text-xl">
                  No preview available
                </p>
                <p className="text-gray-400 text-sm ">
                  {/* {file && Math.ceil(file.size / 1024)}kB -{" "} */}
                  {file && Math.ceil(file?.size / 1024) > 1024
                    ? Math.round(Math.ceil(file?.size / 1024) / 1024) +
                      " " +
                      "MB"
                    : Math.ceil(file?.size / 1024) + " " + "kB"}
                  <span className="uppercase">
                    {" "}
                    - {file?.name.split(".").at(-1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" relative w-full h-[20%]"> */}
      <div className=" fixed w-full h-[20%] -bottom-[1.5rem] left-1/2 -translate-x-1/2">
        <SubmitMessage
          file={file}
          setFile={setFile}
          image={image}
          setImage={setImage}
          revisionMessages={revisionMessages}
          setRevisionMessages={setRevisionMessages}
          messageEndRef={messageEndRef}
          setDeleting={setDeleting}
          markMessagesAsRead={markMessagesAsRead}
        />
      </div>
    </div>
  );
};

export default RevisionsDetails;
