import React, { useEffect, useRef } from "react";
import PageHeader from "../../../SharedComponents/PageHeader";
import TableRevisions from "./components/TableRevisions";
import { useAdminContext } from "../../../Context/AdminContext";
import { useProgressBarContext } from "../../../Context/ProgressBarContext";
import { backend_url } from "../../../axios/instance";
import { useStateShareContext } from "../../../Context/StateContext";

const WorkRevisions = () => {
  const { setShowNavBar } = useAdminContext();
  const { setRevisions } = useProgressBarContext();
  const { firstName, lastName } = useStateShareContext();

  useEffect(() => {
    setShowNavBar(true);
  }, []);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `wss://${backend_url}/ws/revisions/${firstName}/${lastName}/`
    );
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      // alert("arrived");
      // ADDING REVISION
      if (data.action === "add") {
        setRevisions((prev) => [data.revision, ...prev]);
      }
      // UPDATING
      else if (data.action === "update") {
        setRevisions((prev) => {
          const updatedRevisions = prev.map((revision) => {
            if (revision.id == data.revision.id) return data.revision;
            else return revision;
          });
          return updatedRevisions;
        });
      }
      // DELETING
      else if (data.action === "delete") {
        setRevisions((prev) => {
          const updatedList = prev.filter((revision) => {
            return revision.id != data.revision_id;
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
    <div className="w-full px-[1rem] md:px-[2rem] pb-[5rem] dark:bg-darkMode-body min-h-screen bg-gray-100">
      <PageHeader
        title={"Revisions"}
        subTitle={"See the work that that needs to be corrected."}
      />

      <div>
        <TableRevisions />
      </div>
    </div>
  );
};

export default WorkRevisions;
