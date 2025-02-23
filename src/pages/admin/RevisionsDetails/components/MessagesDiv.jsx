import React, { useEffect, useRef } from "react";
import RevisionComment from "./RevisionComment";
import { useStateShareContext } from "../../../../Context/StateContext";
import { backend_url } from "../../../../axios/instance";
import { useParams } from "react-router-dom";

const MessagesDiv = ({
  revisionMessages,
  setRevisionMessages,
  setDeleting,
  markMessagesAsRead,
  setImageToDisplay,
}) => {
  const { firstName } = useStateShareContext();
  const { id } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `wss://${backend_url}/ws/revision-messages/${id}/${firstName}/`
    );
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      //   console.log(data);
      // ADDING REVISION
      if (data.action === "add") {
        setRevisionMessages((prev) => [...prev, data.message]);
        markMessagesAsRead();
      }
      // DELETING
      else if (data.action === "delete") {
        setRevisionMessages((prev) => {
          const updatedList = prev.filter((message) => {
            return message.id != data.message_id;
          });
          return updatedList;
        });
      }
      // READING MESSAGE
      else if (data.action === "read") {
        setRevisionMessages((prev) => {
          const updatedList = prev.map((message, index) => {
            if (index >= prev.length - 2) {
              return { ...message, is_read: true };
            }
            return message;
          });
          return updatedList;
        });
      }
    };

    // Handle WebSocket errors
    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      // alert("error");
    };

    // Close WebSocket on component unmount
    return () => {
      socketRef.current.close();
    };
  }, []);

  return (
    <>
      {revisionMessages &&
        revisionMessages.map((message, index) => {
          if ((!message?.is_mine && message?.is_read) || message?.is_mine)
            return (
              <RevisionComment
                key={index}
                {...message}
                revisionMessages={revisionMessages}
                setRevisionMessages={setRevisionMessages}
                setDeleting={setDeleting}
                markMessagesAsRead={markMessagesAsRead}
                setImageToDisplay={setImageToDisplay}
              />
            );
        })}
    </>
  );
};

export default MessagesDiv;
