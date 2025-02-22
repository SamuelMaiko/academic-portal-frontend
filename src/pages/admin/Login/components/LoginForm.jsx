import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStateShareContext } from "../../../../Context/StateContext";
import instance from "../../../../axios/instance";
import { createNewCookie } from "../../../../Cookies/Cookie";
import Vini from "../../../../assets/Default_pfp.jpg";

const LoginForm = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setDarkMode } = useStateShareContext();
  const [userLoggingIn, setUserLoggingIn] = useState("Writer");
  const navigate = useNavigate();

  const { setFirstName, setLastName, setImageURL } = useStateShareContext();

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await instance.post(
        `/auth/login/?using=${userLoggingIn}`,
        {
          registration_number: registrationNumber,
          password: password,
        }
      );
      console.log(response.data);

      createNewCookie("access_token", response.data.access);
      createNewCookie("refresh_token", response.data.refresh);
      createNewCookie("role", response.data.user.role);

      localStorage.setItem(
        "darkMode",
        JSON.stringify(response.data.user.dark_mode)
      );
      toast.success("logged in successfully");
      setTimeout(() => {
        if (response.data.user.role == "Writer") {
          navigate("/my-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status) {
        const status = error.response.status;
        const message = error.response.data.error;

        switch (status) {
          case 400:
            toast(`${message}`);
            break;
          case 401:
            toast(`${message}`);
            break;
          case 500:
            toast(`Server Error: Internal Server Error.`);
            break;
          default:
            toast(`Error: ${message}`);
            break;
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleUserLogin}
      className="lg:w-[35rem] w-[90%] px-0 lg:px-0 pb-[2rem] bg-neutral-100 mt-[2rem] relative"
    >
      <div className="flex justify-between">
        <div>
          <p>Writer:</p>
          <p>Reg. no: TW5902 Pass: dalton</p>
        </div>
        <div>
          <p>Admin:</p>
          <p>Reg. no: TW7003 Pass: waiyaki</p>
        </div>
      </div>
      {/* <h1 className="text-center text-[29px] lg:text-[35px] ">Login</h1> */}
      <div className="flex h-[3rem] bg-gray-200 ">
        <button
          type="button"
          onClick={() => setUserLoggingIn("Writer")}
          className={` flex-1 text-white text-[16px] lg:text-[20px] font-semibold flex items-center justify-center bg-blue-800
             ${
               userLoggingIn == "Writer" ? "" : "opacity-[0.2]"
             } transition-opacity duration-300`}
        >
          {/* <Dot size={48} /> */}
          <span>Writer Login</span>
        </button>
        <button
          type="button"
          onClick={() => setUserLoggingIn("Admin")}
          className={` flex-1 text-[16px] lg:text-[20px] font-semibold flex items-center justify-center text-white bg-blue-800
            ${
              userLoggingIn == "Admin" ? "" : "  opacity-[0.2]"
            } transition-opacity duration-300`}
        >
          {/* <Dot size={48} /> */}
          <span>Admin Login</span>
        </button>
      </div>
      <div className="mb-3 mt-5 lg:mt-[3rem] px-4">
        <label className=" text-[14px] lg:text-[15px] font-semibold">
          Registration Number <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setRegistrationNumber(e.target.value)}
          className="text-[14px] lg:text-[15px] shadow-[0_0_4px_rgba(0,0,0,0.3)] mt-2 outline-none h-[3rem] pl-3 w-full rounded-lg"
          type="text"
          value={registrationNumber}
          name="username"
          placeholder="Enter Registration No."
        ></input>
      </div>
      <div className="mb-3 mt-5 px-4">
        <label className=" text-[14px] lg:text-[15px] font-semibold">
          Password <span className="text-red-600">*</span>
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="text-[14px] lg:text-[15px] shadow-[0_0_4px_rgba(0,0,0,0.3)] mt-2 outline-none h-[3rem] pl-3 w-full rounded-lg"
          type="password"
          value={password}
          name="password"
          placeholder="Enter password"
        ></input>
        <p className="text-[12px] lg:text-[13px] mt-1 ">
          Password is case sensitive
        </p>
      </div>
      <div className="pb-5 px-4">
        <button
          type="submit"
          className="shadow-[0_0_4px_rgba(0,0,0,0.15)] w-full text-center text-[14px] lg:text-[17px] transition-opacity 
                duration-300 bg-blue-500 hover:opacity-[0.9] mt-5 text-white rounded-lg py-2 "
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center md:justify-between px-12 md:px-5 ">
        <NavLink
          to="/forgot-password"
          className="text-[14px] lg:text-[15px] md:inline block underline mb-2 md:mb-0 hover:text-blue-700 transition-colors duration-300"
          href="#"
        >
          Forgot Password?
        </NavLink>
      </div>
    </form>
  );
};

export default LoginForm;
