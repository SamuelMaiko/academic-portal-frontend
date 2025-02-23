import { Download, Eye, Paperclip } from "phosphor-react";
import React from "react";
import { useLocation } from "react-router-dom";
import truncateFileName from "../utils/truncateFileName";

const FileLink = ({ file_name = "", file, download_url }) => {
  const { pathname } = useLocation();
  // Define the regex pattern
  const regex = /^\/submissions\/(\d+)$/;
  // Test the pathname against the regex
  const match = regex.exec(pathname);

  return (
    <div className="flex justify-between w-[70%] md:w-full">
      {/* hover:text-blue-700 dark:hover:text-blue-400 */}
      <div
        className="text-sm flex items-center gap-2 cursor-pointer 
          hover:underline 
      transition-colors duration-300 mb-2 w-fit
    "
      >
        <span>
          <Paperclip size={20} />
        </span>
        <p
          className={`md:whitespace-nowrap line-clamp-2 md:line-clamp-none hidden md:block text-[14px] lg:text-[15px]`}
        >
          {truncateFileName(file_name, 40)}
        </p>
        <p className="md:whitespace-nowrap block md:hidden line-clamp-2 md:line-clamp-none text-[14px] lg:text-[15px]">
          {truncateFileName(file_name, 25)}
        </p>
      </div>
      <div className="flex gap-4 ml-5 md:mr-[60%]">
        <a href={file} target="blank" className={`${match ? "hidden" : ""}`}>
          <Eye
            // dark:hover:text-[#90ee90] hover:text-[#4caf50]
            size={20}
            className="cursor-pointer text-black dark:text-white
           transition-colors duration"
          />
        </a>
        <a
          href={download_url}
          download
          className={`hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-colors duration-300 ${
            download_url ? "" : "hidden"
          }`}
        >
          {/* dark:hover:text-[#90ee90] hover:text-[#4caf50]*/}
          <Download
            size={20}
            className="cursor-pointer text-black dark:text-white
           transition-colors duration "
          />
        </a>
      </div>
    </div>
  );
};

export default FileLink;
