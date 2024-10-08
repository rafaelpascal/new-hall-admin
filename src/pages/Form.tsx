import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { login } from "../assets";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  adminLogin,
  forgot_pass,
  verify_otp_fr,
  new_password,
} from "../utils/apiService";
import { AnimatePresence, motion } from "framer-motion";
import { success } from "../assets";
import { useUser } from "../context/user-provider";
import { FaArrowsRotate } from "react-icons/fa6";
import OtpInput from "react-otp-input";
import { error } from "../assets";

interface InputState {
  email: string;
  password: string;
}

const Form = () => {
  const { setUser } = useUser();
  const [otp, setOtp] = useState<string>("");
  // const [isFormSubmited, setisFormSubmited] = useState(false);
  const navigate = useNavigate();
  const tooltipRef = useRef<HTMLElement>(null);
  const [forgotemail, setforgotemail] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [showConfirmpassword, setshowConfirmpassword] = useState(false);
  const [showCreatepass, setshowCreatepass] = useState(false);
  const [isOptsent, setOptsent] = useState(false);
  const [isSendOtp, setisSendOtp] = useState(false);
  const [loginsuccess, setLoginSuccess] = useState(false);
  const [showforgotPassword, setshowForgotpass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setformData] = useState<InputState>({
    email: "",
    password: "",
  });
  const [newPassword, setnewPassword] = useState({
    password: "",
    Confirmpassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const togglecmPasswordVisibility = () => {
    setshowConfirmpassword((prevState) => !prevState);
  };

  const handleChange = (otp: string) => {
    setOtp(otp);
  };

  const handlePassChange = (e: { target: { value: any } }) => {
    const newPassword = e.target.value;
    setformData((prevState) => ({
      ...prevState,
      password: newPassword,
    }));

    // Check password criteria
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 12 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // const submitResult = () => {};

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const loginres = await adminLogin(formData);
      const staffRec = loginres.data.findEmail;
      console.log(staffRec);

      if (rememberMe) {
        localStorage.setItem("username", formData.email);
        localStorage.setItem("password", formData.password);
      } else {
        // If rememberMe is not selected, clear stored login details
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
      setUser({ staffRec });
      if (loginres.success) {
        setLoading(false);
        setLoginSuccess(true);
        setTimeout(() => {
          setLoginSuccess(false);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setLoginFailed(true);
      console.log(error);
    }
  };

  const handleOtpsent = async () => {
    try {
      setisSendOtp(true);
      const data = {
        email: forgotemail.email,
      };
      const otp_record = await forgot_pass(data);
      if (otp_record) {
        setOptsent(true);
        setisSendOtp(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleforgotChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setforgotemail((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setformData((prevState) => ({
        ...prevState,
        email: storedUsername,
        password: storedPassword,
      }));
      // setIsLoginEmailValid(true);
      setRememberMe(true);
    }
  }, []);

  const forgotPassword = () => {
    setshowForgotpass(true);
  };

  const handleOtpverified = async () => {
    try {
      const data = {
        email: forgotemail.email,
        otp: otp,
      };
      const res = await verify_otp_fr(data);
      if (res) {
        setshowCreatepass(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleNewSubmit = async () => {
    try {
      const data = {
        email: forgotemail.email,
        password: newPassword.password,
      };
      const res = await new_password(data);
      if (res) {
        setOptsent(false);
        setshowForgotpass(false);
        setshowCreatepass(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const inputStyle = {
    width: "3rem",
    height: "3rem",
    margin: "0 0.5rem",
    fontSize: "1.5rem",
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.3)",
  };

  const handlefrPassChange = (e: { target: { value: any } }) => {
    const nwPassword = e.target.value;
    setnewPassword((prevState) => ({
      ...prevState,
      password: nwPassword,
    }));

    // Check password criteria
    if (nwPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else if (!/[a-z]/.test(nwPassword)) {
      setPasswordError("Password must contain at least one lowercase letter");
    } else if (!/[A-Z]/.test(nwPassword)) {
      setPasswordError("Password must contain at least one uppercase letter");
    } else if (!/\d/.test(nwPassword)) {
      setPasswordError("Password must contain at least one digit");
    } else {
      setPasswordError("");
    }
  };

  const handlecmfrPassChange = (e: { target: { value: any } }) => {
    const cmPassword = e.target.value;
    setnewPassword((prevState) => ({
      ...prevState,
      Confirmpassword: cmPassword,
    }));
  };

  const handleLogin = () => {
    setOptsent(false);
    setshowForgotpass(false);
    setshowCreatepass(false);
  };

  const handleModalClose = () => {
    setLoginFailed(false);
  };
  return (
    <>
      {loading && (
        <div className="fixed right-0 top-0 z-[999] h-full w-full bg-transparent backdrop-blur-[10px] transition-[.5s]"></div>
      )}
      <div className="w-full h-full bg-[#F6F6F6] px-4">
        <div className="flex flex-col lg:flex-row w-full justify-between items-center p-0 h-[100vh] bg-[#F6F6F6]">
          <div className="w-full lg:w-[60%] bg-inherit flex justify-center items-center flex-1 h-full">
            <img src={login} alt="" className="w-[70%] rounded-lg" />
          </div>
          {showforgotPassword ? (
            <>
              {isOptsent ? (
                <>
                  {showCreatepass ? (
                    <div className="bg-[#F6F6F6] w-full lg:w-[40%] rounded-lg flex justify-center items-start py-3 flex-col gap-y-2 px-4 shadow-2xl">
                      <h2 className="bg-inherit text-left mb-8 font-bold font-DMSans text-[20px]">
                        Please Create New Password
                      </h2>
                      <div className="h-[50px] flex justify-start items-center gap-2 border-[1px] p-2 border-slate-400 rounded-lg w-full">
                        <RiLockPasswordLine className="w-[24px] h-[24px] " />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword.password}
                          // onChange={(e) => setPassword(e.target.value)}
                          onChange={handlefrPassChange}
                          placeholder="Password"
                          className="w-full  px-3 bg-[#f6f6f6] rounded-lg h-full outline-none"
                        />
                        <button
                          className="cursor-pointer text-[25px]"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaRegEyeSlash className="text-[25px]" />
                          ) : (
                            <MdOutlineRemoveRedEye className="text-[25px]" />
                          )}
                        </button>
                      </div>
                      <div className="h-[50px] flex justify-start items-center gap-2 border-[1px] p-2 border-slate-400 rounded-lg w-full">
                        <RiLockPasswordLine className="w-[24px] h-[24px] " />
                        <input
                          type={showConfirmpassword ? "text" : "password"}
                          value={newPassword.Confirmpassword}
                          // onChange={(e) => setPassword(e.target.value)}
                          onChange={handlecmfrPassChange}
                          placeholder="Confirm Password"
                          className="w-full  px-3 bg-[#f6f6f6] rounded-lg h-full outline-none"
                        />
                        <button
                          className="cursor-pointer text-[25px]"
                          onClick={togglecmPasswordVisibility}
                        >
                          {showConfirmpassword ? (
                            <FaRegEyeSlash className="text-[25px]" />
                          ) : (
                            <MdOutlineRemoveRedEye className="text-[25px]" />
                          )}
                        </button>
                      </div>
                      {newPassword.password !== newPassword.Confirmpassword && (
                        <p className="my-1 text-red-500">
                          Password Doesn't Match!
                        </p>
                      )}
                      {newPassword.password === newPassword.Confirmpassword && (
                        <p className="my-1 text-green-600">Password Match!</p>
                      )}
                      {passwordError && (
                        <p className="my-1 text-red-500">{passwordError}</p>
                      )}
                      <span>
                        remember Password?
                        <button
                          className="text-[#80BD25]"
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </span>
                      {newPassword.password !== newPassword.Confirmpassword ? (
                        <button className="w-full mt-8 bg-[#eae9e9] text-[16px] rounded-lg font-semibold text-[#000] h-[50px] disabled cursor-not-allowed">
                          Submit
                        </button>
                      ) : (
                        <button
                          onClick={handleNewSubmit}
                          className="w-full mt-8 bg-[#80BD25] text-[16px] rounded-lg font-semibold text-[#fff] h-[50px]"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#F6F6F6] w-full lg:w-[40%] rounded-lg flex justify-center items-start py-3 flex-col gap-y-2 px-4 shadow-2xl">
                      <h2 className="bg-inherit text-left mb-4 font-bold font-DMSans text-[20px]">
                        Verify One Time Password
                      </h2>
                      <p className="bg-inherit mb-4 text-left font-normal font-DMSans text-[16px]">
                        Verify Its you with the One time password we sent to
                        your Email Address.
                      </p>
                      <div className="h-[50px] flex justify-center items-center w-full p-2">
                        <OtpInput
                          value={otp}
                          onChange={handleChange}
                          numInputs={6}
                          shouldAutoFocus
                          renderInput={(props) => <input {...props} />}
                          inputStyle={inputStyle}
                          // focusStyle={focusStyle}
                        />
                      </div>
                      <span>
                        remember Password?
                        <button
                          className="text-[#80BD25]"
                          onClick={handleLogin}
                        >
                          Login
                        </button>
                      </span>
                      {forgotemail.email === "" ? (
                        <button className="w-full mt-8 bg-[#eae9e9] text-[16px] rounded-lg font-semibold text-[#000] h-[50px] disabled cursor-not-allowed">
                          verify OTP
                        </button>
                      ) : (
                        <button
                          onClick={handleOtpverified}
                          className="w-full mt-8 bg-[#80BD25] text-[16px] rounded-lg font-semibold text-[#fff] h-[50px]"
                        >
                          verify OTP
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#F6F6F6] w-full lg:w-[40%] rounded-lg flex justify-center items-start py-3 flex-col gap-y-2 px-4 shadow-2xl">
                  <h2 className="bg-inherit text-left mb-4 font-bold font-DMSans text-[20px]">
                    Forgot Your Password ?
                  </h2>
                  <p className="bg-inherit mb-4 text-left font-normal font-DMSans text-[16px]">
                    Enter your registered email address. we'll send you a code
                    to reset your password.
                  </p>
                  <div className="h-[50px] w-full flex justify-start items-center gap-2 border-[1px] p-2 border-slate-400 rounded-lg">
                    <FaRegUser className="w-[24px] h-[24px] " />
                    <input
                      type="text"
                      name="email"
                      value={forgotemail.email}
                      onChange={handleforgotChange}
                      placeholder="Email Address"
                      className="bg-[#f6f6f6]  px-3 rounded-lg h-full w-full outline-none"
                    />
                  </div>

                  <span>
                    {" "}
                    remember Password?{" "}
                    <button className="text-[#80BD25]" onClick={handleLogin}>
                      Login
                    </button>
                  </span>
                  {forgotemail.email === "" ? (
                    <button className="w-full mt-8 bg-[#eae9e9] text-[16px] rounded-lg font-semibold text-[#000] h-[50px] disabled cursor-not-allowed">
                      Send OTP
                    </button>
                  ) : (
                    <button
                      onClick={handleOtpsent}
                      className="w-full mt-8 bg-[#80BD25] text-[16px] rounded-lg font-semibold text-[#fff] h-[50px]"
                    >
                      {isSendOtp === true ? (
                        <p className="bg-inherit">Sending...</p>
                      ) : (
                        <p className="bg-inherit"> Send OTP</p>
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#F6F6F6] mr-6 w-full lg:w-[40%] rounded-lg flex justify-center items-start py-3 flex-col gap-y-2 px-4 shadow-2xl">
              <h2 className="bg-inherit text-left mb-8 font-bold font-DMSans text-[20px]">
                Welcome 👋 Please Login here
              </h2>
              <div className="h-[50px] w-full flex justify-start items-center gap-2 border-[1px] p-2 border-slate-400 rounded-lg">
                <FaRegUser className="w-[24px] h-[24px] " />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="bg-[#f6f6f6]  px-3 rounded-lg h-full w-full outline-none"
                />
              </div>
              <div className="h-[50px] flex justify-start items-center gap-2 border-[1px] p-2 border-slate-400 rounded-lg w-full">
                <RiLockPasswordLine className="w-[24px] h-[24px] " />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  // onChange={(e) => setPassword(e.target.value)}
                  onChange={handlePassChange}
                  placeholder="Password"
                  className="w-full  px-3 bg-[#f6f6f6] rounded-lg h-full outline-none"
                />
                <button
                  className="cursor-pointer text-[25px]"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="text-[25px]" />
                  ) : (
                    <MdOutlineRemoveRedEye className="text-[25px]" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="my-1 text-red-500">{passwordError}</p>
              )}
              <div className="flex w-full items-center justify-between">
                <div className="my-3 flex items-center justify-between gap-2">
                  <input
                    type="checkbox"
                    className="h-[24px] w-[24px] border-[4px] checked:bg-[#80BD25]"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <h2 className="text-[16px] font-semibold">Remember Me</h2>
                </div>
                <button onClick={forgotPassword} className="my-3">
                  <h2 className="text-[16px] font-normal text-[#80BD25]">
                    Forgot Password
                  </h2>
                </button>
              </div>
              {formData.password === "" ? (
                <button className="w-full mt-8 bg-[#eae9e9] text-[14px] rounded-lg font-semibold text-[#000] h-[50px] disabled cursor-not-allowed">
                  Login
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full mt-8 bg-[#80BD25] text-[14px] rounded-lg font-semibold text-[#fff] h-[50px]"
                >
                  Login
                </button>
              )}
            </div>
          )}
          {loginsuccess && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: loginsuccess ? 1 : 0,
                  y: loginsuccess ? 0 : -20,
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 top-0 z-[9999] flex h-full bg-white min-h-screen w-full items-center justify-center overflow-y-auto"
              >
                <div
                  ref={tooltipRef as React.RefObject<HTMLDivElement>}
                  className={
                    "mb-32 h-auto max-h-[540px] w-[26%] overflow-y-auto rounded-[20px] bg-[#fff] px-4 shadow-md [@media(max-width:1200px)]:w-[50%] [@media(max-width:700px)]:w-[90%]"
                  }
                >
                  <div className="flex w-full  items-center bg-[#fff] justify-center">
                    <div className="flex flex-col items-center bg-[#fff] justify-center py-6 lg:w-[336px]">
                      <motion.img
                        src={success}
                        alt=""
                        initial="hidden"
                        animate="visible"
                        variants={fadeInVariants}
                        transition={{ duration: 6 }}
                        className="mb-8 w-[30%]"
                      />
                      <h2 className="pb-4 text-center text-[25px] font-semibold bg-white text-[#16151C]">
                        Login Successfull
                      </h2>
                      <p className="pb-4 text-center text-[14px] text-[#a59fc4] bg-white">
                        Proceed to your Dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          {loginFailed && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: loginFailed ? 1 : 0,
                  y: loginFailed ? 0 : -20,
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 top-0 z-[9999] bg-white flex h-full min-h-screen w-full items-center justify-center overflow-y-auto"
              >
                <div
                  ref={tooltipRef as React.RefObject<HTMLDivElement>}
                  className={
                    "mb-32 h-auto max-h-[540px] w-[26%] overflow-y-auto rounded-[20px] bg-[#fff] px-4 shadow-md [@media(max-width:1200px)]:w-[50%] [@media(max-width:700px)]:w-[90%]"
                  }
                >
                  <div className="flex w-full  items-center bg-inherit justify-center">
                    <div className="flex flex-col items-center bg-inherit justify-center py-6 lg:w-[336px]">
                      <motion.img
                        src={error}
                        alt=""
                        initial="hidden"
                        animate="visible"
                        variants={fadeInVariants}
                        transition={{ duration: 6 }}
                        className="mb-8 w-[30%] bg-inherit"
                      />
                      <h2 className="pb-4 text-center text-[25px] bg-inherit font-semibold text-[#16151C]">
                        Login Failed
                      </h2>
                      <p className="pb-4 text-center text-[14px] bg-inherit text-[#a59fc4]">
                        Check the login Credentials and try again.
                      </p>
                      <button
                        onClick={handleModalClose}
                        className="h-auto w-full rounded-[10px] bg-[#80BD25] text-center text-[#fff] sm:h-[46px] [@media(max-width:800px)]:p-3"
                      >
                        Return to login
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          {loading && (
            <div className="loading-overlay flex h-full items-center justify-center lg:h-[100vh]">
              <FaArrowsRotate className="loading-animation text-[8rem] text-[#16151C]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
