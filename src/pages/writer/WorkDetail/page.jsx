import React, { useEffect, useState } from "react";
import PageHeader from "../../../SharedComponents/PageHeader";
import WorkDetailBlock from "./components/WorkDetailBlock";
import {
  Hash,
  Notepad,
  FileDoc,
  Calendar,
  HourglassMedium,
  ChartPieSlice,
  Warning,
} from "phosphor-react";
import { Badge } from "keep-react";
import WorkImages from "./components/WorkImages";
import WorkFiles from "./components/WorkFiles";
import { useStateShareContext } from "../../../Context/StateContext";
import CountdownToDate from "../WorkFeed/components/CountdownToDate";
import { toast } from "react-toastify";
import instance from "../../../axios/instance";
import { useParams } from "react-router-dom";
import relativeTime from "../WorkFeed/components/datetime/RelativeTime";
import formatDate from "../WorkFeed/components/datetime/formatDate";
import TakeUpButton from "./components/TakeUpButton";
import RevokeButton from "./components/RevokeButton";
import { useProgressBarContext } from "../../../Context/ProgressBarContext";

const WorkDetail = () => {
  const { setShowRevokeWorkModal } = useStateShareContext();
  const IsTakeUp = false;
  const [loading, setLoading] = useState(true);
  const { workDetails, setWorkDetails } = useProgressBarContext();

  // getting work id
  const { id } = useParams();

  const getWorkDetails = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/work/${parseInt(id, 10)}/`);
      setWorkDetails(response.data);
      // console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status) {
        const status = error.response.status;
        const message = error.response.data.error;

        switch (status) {
          case 404:
            console.log(message);
            break;
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
    } finally {
      setLoading(false);
    }
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Validates if the date is not NaN
  };

  const deadline = isValidDate(workDetails.deadline)
    ? `Due on ${formatDate(workDetails.deadline)}`
    : "Due date not available";

  useEffect(() => {
    getWorkDetails();
  }, []);

  return (
    <div className="w-full px-0 md:px-[2rem] dark:bg-darkMode-body ">
      <div className="px-[1rem] md:px-0">
        <PageHeader
          title={"Work Details"}
          subTitle={"View all the details of work."}
        />
        <div className="min-h-fit pb-[4rem] ">
          <div className=" pr-2">
            <div className="my-2 flex items-center">
              <p className="dark:text-white text-[14px] lg:text-[16px]">
                Posted {relativeTime(workDetails.created_at)}{" "}
              </p>
              <TakeUpButton
                hasWriter={workDetails && workDetails.has_writer}
                setWorkDetails={setWorkDetails}
              />
              <RevokeButton
                isMine={workDetails && workDetails.is_mine}
                setShowRevokeWorkModal={setShowRevokeWorkModal}
              />
            </div>
            <WorkDetailBlock
              icon={<Hash size={22} />}
              detail={workDetails && workDetails.work_code}
            />
            <WorkDetailBlock
              icon={<Notepad size={22} />}
              detail={workDetails.type && workDetails.type.name}
              type="type"
            />
            <WorkDetailBlock
              icon={<FileDoc size={22} />}
              detail={`${workDetails && workDetails.words} words`}
            />
            <WorkDetailBlock
              icon={<Warning size={22} />}
              detail={(workDetails && workDetails.comment) || "No comment"}
            />
            <WorkDetailBlock icon={<Calendar size={22} />} detail={deadline} />
            <WorkDetailBlock
              icon={<HourglassMedium size={22} />}
              detail={<CountdownToDate deadline={workDetails.deadline} />}
            />
            <WorkDetailBlock
              icon={<ChartPieSlice size={22} />}
              detail={
                <>
                  <Badge
                    showIcon={true}
                    className={`${
                      workDetails.status == "Not started" ? "" : "hidden"
                    } bg-[#e0e0e0] dark:bg-[#2c2c2c] text-[#333] dark:text-[#ccc] 
                    hover:bg-[#d0d0d0] dark:hover:bg-[#3c3c3c] transition-colors duration-300 text-[12px] lg:text-[14px]`}
                  >
                    {workDetails.status}
                  </Badge>
                  <Badge
                    showIcon={true}
                    className={`${
                      workDetails.status == "In Progress" ? "" : "hidden"
                    } bg-[#ffeb3b] dark:bg-[#fdd835] text-[#333] dark:text-[#000] 
                    hover:bg-[#fdd835] dark:hover:bg-[#e0c020] transition-colors duration-300 text-[12px] lg:text-[14px]`}
                  >
                    {workDetails.status}
                  </Badge>
                  <Badge
                    showIcon={true}
                    className={`${
                      workDetails.status == "Completed" ? "" : "hidden"
                    } bg-[#4caf50] dark:bg-[#66bb6a] text-[#fff] dark:text-[#fff] 
                    hover:bg-[#388e3c] dark:hover:bg-[#4caf50] transition-colors duration-300 text-[12px] lg:text-[14px]`}
                  >
                    {workDetails.status}
                  </Badge>
                </>
              }
            />
          </div>
        </div>
      </div>
      {/* bottom section */}
      <div className="bg-neutral-100 dark:bg-darkMode-bars dark:text-darkMode-text p-4 my-8">
        <WorkImages
          images={workDetails.images}
          zipUrl={workDetails.images_zip_url}
          zipName={workDetails.work_code}
        />
        <WorkFiles files={workDetails.files} />
      </div>
    </div>
  );
};

export default WorkDetail;
