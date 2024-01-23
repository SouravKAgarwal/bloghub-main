import { Paper, PinInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useStore from "../store";
import { useResend, useVerification } from "../hooks/authHooks";
import { Loading, Button } from "../components";

const OTPVerification = () => {
  const otpData = JSON.parse(localStorage.getItem("otp_data"));
  const navigate = useNavigate();
  const [visible, { toggle }] = useDisclosure(false);

  const { user } = useStore((state) => state);
  const { mutate, isPending } = useVerification(toast, toggle);
  const resend = useResend(toast, toggle);

  const [seconds, setSeconds] = useState(120);
  const [countdown, setCountdown] = useState(null);

  const handleSubmit = (val) => {
    mutate({ id: otpData.id, otp: val });
  };

  const handleResendOTP = () => {
    resend.mutate(otpData.id);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    setCountdown(
      setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000)
    );

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(countdown);
    }
  }, [seconds, countdown]);

  useEffect(() => {
    if (!otpData?.otpLevel) navigate("/auth");
    if (user?.emailVerified) navigate("/");
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Paper shadow="lg" p="xl" className="dark:bg-[#0e1627] bg-white">
        <div className="flex flex-col items-center justify-center mb-6">
          <p className="text-2xl font-semibold text-center dark:text-gray-400 text-slate-700">
            OTP Verification
          </p>
          <span className="text-sm dark:text-gray-500 text-slate-700">
            Please enter the OTP sent to your mail.
          </span>
        </div>

        <PinInput
          oneTimeCode
          autoFocus={true}
          type="number"
          length={6}
          size="xl"
          onComplete={(value) => handleSubmit(value)}
        />

        <div className="pt-5 flex items-center justify-center gap-3 text-base">
          {seconds === 0 ? (
            <Button
              onClick={() => handleResendOTP()}
              styles="text-base text-black cursor-pointer bg-transparent font-bold"
              label="Resend OTP"
            />
          ) : (
            <>
              <p className="font-semibold">OTP will expire in :</p>
              <span className="text-rose-600 font-semibold">
                {formatTime(seconds)}
              </span>
            </>
          )}
        </div>
        <Loading visible={isPending || resend.isPending} />
        <Toaster richColors />
      </Paper>
    </div>
  );
};

export default OTPVerification;
