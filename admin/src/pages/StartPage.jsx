import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import useStore from "../store";
import { Loading, LoginForm, NavBar, SignUpForm, Button } from "../components";
import { MdArrowForward } from "react-icons/md";
import { Modal } from "@mantine/core";

const StartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, signInModal, setSignInModal } = useStore();

  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(signInModal);
  const [isSignIn, setIsSignIn] = useState(true);
  const [formClose, setFormClose] = useState(false);

  let from = location?.state?.from?.pathname || "/";

  const handleCloseModal = () => {
    close();
    setSignInModal(!signInModal);
  };

  useEffect(() => {
    user?.token && navigate(from);
  }, [user]);

  return (
    <div className="w-full h-screen px-0">
      <NavBar />

      <div className="w-full h-full flex flex-col items-center justify-center md:pt-24 md:gap-6 px-4">
        <div className="w-full xl:max-w-2xl flex flex-col items-center justify-center gap-y-10 2xl:-mt-20">
          <span className="hidden md:flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bg-transparent dark:border-gray-700 dark:text-gray-400 bg-gray-300 text-gray-600">
            Unleash Your Words, and share with others.{" "}
            <Link className="flex gap-1 items-center font-semibold text-[18px] dark:text-white text-slate-700">
              Join Now
              <MdArrowForward />
            </Link>
          </span>
          <h1 className="text-4xl 2xl:text-6xl font-bold text-center dark:text-gray-400 text-slate-700">
            Join Our Community of Passionate Writers!
          </h1>
          <span className="text-center text-base md:text-[14px] dark:text-gray-500 text-slate-600">
            "Embark on a literary journey with fellow wordsmiths!. Unleash your
            imagination, share your blogs, and connect with like-minded
            individuals who share a love for the written word."
          </span>
          <div className="flex gap-6 items-center mt-6">
            <Button
              onClick={open}
              styles="text-white rounded h-10 text-sm dark:bg-blue-600 bg-black font-semibold"
              label="Get Started"
            />
            <Link
              to="/"
              className="flex gap-2 items-center font-semibold dark:text-white text-gray-800"
            >
              Contact
              <MdArrowForward />
            </Link>
          </div>
        </div>
      </div>

      <Modal
        opened={opened || signInModal}
        onClose={formClose ? () => {} : handleCloseModal}
        title={isSignIn ? "Welcome Back, Login" : "Hey there, Register"}
        centered
      >
        {isSignIn ? (
          <LoginForm
            isSignIn={isSignIn}
            setIsSignIn={setIsSignIn}
            toast={toast}
            toggle={toggle}
            setFormClose={setFormClose}
          />
        ) : (
          <SignUpForm
            isSignIn={isSignIn}
            setIsSignIn={setIsSignIn}
            toast={toast}
            toggle={toggle}
            setFormClose={setFormClose}
          />
        )}
        <Loading visible={visible} />
        <Toaster richColors />
      </Modal>
    </div>
  );
};

export default StartPage;
