import React, { useEffect, useState } from "react";
import PageHeader from "../../../SharedComponents/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import CommentForm from "./components/CommentForm";
import getSubmissionDetails from "./api/getSubmissionDetails";
import Loader from "../../../SharedComponents/Loader";
import FileLink from "../../../SharedComponents/FileLink";

const SubmissionsDetail = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("Hello there this is me here");
  const [submissionDetails, setSubmissionDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSubmissionDetails(id).then((data) => {
      setComment(data.message);
      setFile({
        file_name: data.file,
        file_download_link: data.file_download_link,
      });

      setSubmissionDetails(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative w-full px-[1rem] md:px-[2rem] pb-[44%] md:pb-[5rem] h-[80vh] dark:bg-darkMode-body ">
      <PageHeader
        title={"Submission Details"}
        subTitle={"View the details of a submission."}
      />
      <div>
        {/* comment form */}
        <p
          onClick={() =>
            navigate(
              `/manage-work/${
                submissionDetails.work && submissionDetails.work.id
              }/change`
            )
          }
          className="my-2 font-semibold text-[15px] lg:text-[16px] text-blue-500 hover:text-blue-700 underline cursor-pointer transition-colors duration-300 hover:no-underline"
        >
          {submissionDetails.work && submissionDetails.work.work_code}
        </p>
        <CommentForm
          comment={comment}
          setComment={setComment}
          work={submissionDetails && submissionDetails.work}
        />
        <div className="flex flex-col gap-5 mt-[3rem] ">
          <h3 className="font-medium text-[14px] lg:text-[15px] ">File</h3>
          <div
            className={`flex gap-8 ${
              file ? "" : "hidden"
            } md:w-fit items-center`}
          >
            {file && (
              <FileLink
                file_name={
                  file && file.file_name
                    ? file.file_name.split("/").at(-1)
                    : "No file available"
                }
                download_url={file && file.file_download_link}
              />
            )}
          </div>
        </div>
      </div>
      {/* loader of the page */}
      <div
        className={`absolute bg-[rgba(255,255,255,0.9)] inset-0 h-[80vh] bottom-0 flex flex-col items-center justify-center
        ${loading ? "" : "hidden"}
        `}
      >
        <Loader loading={loading} />
        <h1 className="font-semibold">Loading ...</h1>
      </div>
    </div>
  );
};

export default SubmissionsDetail;
