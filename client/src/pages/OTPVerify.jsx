import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { Button, InputBox, Logo } from "../components";
import { verifyUser, resendOTP } from "../utils/apiCalls";
import useStore from "../store";
import { saveUserInfo } from "../utils";
import { Navigate, useLocation } from "react-router-dom";

const OTPVerify = () => {
  const [otp, setOtp] = useState("");
  const { user, signIn, setIsLoading } = useStore();

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await verifyUser(user?.user?._id, otp, user.token);

    setIsLoading(false);

    if (response?.success) {
      saveUserInfo(user, signIn);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    const response = await resendOTP(user?.user?._id);

    setIsLoading(false);

    if (response.success) {
      toast.success("OTP resent successfully");
    } else {
      toast.error("Failed to resend OTP");
    }
  };

  const location = useLocation();

  if (user?.user?.emailVerified)
    return <Navigate to="/" state={{ from: location }} replace />;

  return (
    <div className="flex w-full h-[100vh] transition-all duration-500">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center">
        <Logo type="verify" />
        <span className="text-xl font-semibold text-white">
          Verify your account
        </span>
      </div>
      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#03132f] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full w-full justify-center flex flex-col items-center py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden -ml-8">
            <Logo />
          </div>
          <div className="w-full space-y-6 flex flex-col justify-center">
            <h2 className="text-center text-md sm:text-2xl lg:text-lg xl:text-3xl font-semibold text-gray-900 dark:text-white">
              Enter OTP to Verify Your Account
            </h2>
            <form
              className="max-w-md w-full space-y-2"
              onSubmit={handleOTPSubmit}
            >
              <InputBox
                type="text"
                label="OTP"
                placeholder="Enter OTP"
                name="otp"
                value={otp}
                onChange={handleOTPChange}
                isRequired={true}
              />
              <div className="flex gap-4">
                <Button
                  label="Verify OTP"
                  type="submit"
                  styles="w-full flex justify-center py-2 border border-transparent rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
                />
                <Button
                  label="Resend OTP"
                  styles="w-full flex justify-center py-2 bg-white text-black dark:bg-rose-800 dark:text-white rounded-full border dark:border-none border-gray-300"
                  onClick={handleResendOTP}
                />
              </div>
            </form>
            <Toaster richColors />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
