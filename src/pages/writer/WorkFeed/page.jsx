import React, { useEffect, useRef, useState } from "react";
import WorkCard from "./components/WorkCard";
import PageHeader from "../../../SharedComponents/PageHeader";
import SearchInput from "./components/SearchInput";
import Filters from "./components/Filters";
import UnavailableDark from "../../../assets/UnavailableDark.png";
import UnavailableLight from "../../../assets/UnavailableLight.png";
import { toast } from "react-toastify";
import { useProgressBarContext } from "../../../Context/ProgressBarContext";
import instance, { backend_url } from "../../../axios/instance";
import { useStateShareContext } from "../../../Context/StateContext";
import Footer from "../../../SharedComponents/Footer";
import Loader from "../../../SharedComponents/Loader";
import { useAdminContext } from "../../../Context/AdminContext";

const WorkFeed = () => {
  const { work, setWork } = useProgressBarContext();
  const [loading, setLoading] = useState(true);
  const { setShowNavBar } = useAdminContext();
  const {
    filters,
    darkMode,
    firstName,
    lastName,
    getDetails,
    setShowCarouselModal,
  } = useStateShareContext();

  useEffect(() => {
    getWork();
    // getDetails();
  }, []);

  const getWork = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/work/");
      setWork(response.data);
      // console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status) {
        const status = error.response.status;
        const message = error.response.data;

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowNavBar(true);
    setShowCarouselModal(false);
  }, []);

  const [showBanner, setShowBanner] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(`wss://${backend_url}/ws/work/`);

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // alert("arrived");
      // console.log(data);

      if (data.action === "add") {
        if (!data.work.has_writer) {
          setWork((prevWork) => [data.work, ...prevWork]);
          // // Show banner only if the user has scrolled away from the top
          // if (window.scrollY > 128) {
          //   setShowBanner(true);
          // }
        }
      } else if (data.action === "update") {
        if (!data.work.has_writer) {
          setWork((prevWork) => {
            const exists = prevWork.some((task) => task.id === data.work.id);
            if (exists) {
              const updatedList = prevWork.map((work) => {
                if (work.id == data.work.id) return data.work;
                // else if
                else return work;
              });
              return updatedList;
            } else {
              return [data.work, ...prevWork];
            }
          });
        }
        // DELETING the work IF edited to have a writer
        else {
          setWork((prevWork) => {
            const newList = prevWork.filter((work) => work.id !== data.work.id);
            return newList;
          });
        }
      }
      // when deleting the work
      if (data.action === "delete") {
        setWork((prevWork) => {
          const newList = prevWork.filter((work) => work.id !== data.work_id);
          return newList;
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
    <div
      className={` relative ] pb-[5rem] dark:bg-darkMode-body dark:text-darkMode-text `}
    >
      {showBanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            backgroundColor: "orange",
            color: "white",
            padding: "10px",
            textAlign: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setShowBanner(false);
          }}
        >
          New tasks available! Click to view ↑
        </div>
      )}

      <div className="sticky top-[5rem] bg-white dark:bg-darkMode-body z-[10] pb-3 pt-4 px-[1rem] md:px-[2rem">
        <SearchInput />
        <Filters />
      </div>
      {/* bg-gray-100 */}
      <div className="min-h-[100vh] w-[100%] md:w-[70%] px-[1rem] md:px-[2rem">
        <PageHeader
          title={"Available work"}
          subTitle={"Browse work that matches your experience."}
        />
        <Loader loading={loading} />
        <div className={`${loading ? "hidden" : ""}`}>
          {work &&
            work.map((work, index) => {
              return <WorkCard key={index} {...work} />;
            })}
        </div>
        <div
          className={`pb-[8rem] ${loading || work.length > 0 ? "hidden" : ""}`}
        >
          <img
            className="mx-auto h-[10rem] lg:h-auto lg:w-[16rem]"
            src={darkMode ? UnavailableDark : UnavailableLight}
            alt=""
          />
          <p className="font-bold text-[17px] md:text-xl text-center">
            No work found!
          </p>
          <p className="font-medium text-[13px] lg:text-[14px] text-center mt-2">
            work will appear here.
          </p>
        </div>
      </div>
      <div className="fixed top-[11rem] right-[2rem] md:w-[21%] z-40 overflow-hidden hidden md:block">
        <Footer side={true} />
      </div>
    </div>
  );
};

export default WorkFeed;
