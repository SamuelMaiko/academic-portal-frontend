import React from "react";
import { Download } from "lucide-react";
import { useStateShareContext } from "../../../../Context/StateContext";

const ImageBlock = ({ image, image_name, download_url, combined }) => {
  // const { setShowCarouselModal } = useStateShareContext();

  // JUST to prevent propagation nothing else
  const handleDownload = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      // onClick={() => setShowCarouselModal(true)}
      className="relative size-[6rem] cursor-pointer hover:bg-gray-400 overflow-hidden"
    >
      <img className="h-full w-full " src={image} alt={image_name} />
      <div
        className="bg-transparent hover:bg-[rgba(0,0,0,0.2)] transition-colors duration-300 
      absolute inset-0 z-10 size-full"
      ></div>
      {/* download icon */}
      <a href={download_url} download={combined}>
        <Download
          size={20}
          className="absolute top-1 right-1 text-white z-20"
          onClick={handleDownload}
        />
      </a>
    </div>
  );
};

export default ImageBlock;
