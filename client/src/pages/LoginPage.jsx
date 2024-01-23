import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from "sonner";
import { Link } from "react-router-dom";
import { Button, Divider, InputBox, Logo } from "../components";
import useStore from "../store";
import { saveUserInfo } from "../utils";
import { emailLogin, getGoogleSignIn } from "../utils/apiCalls";

const LoginPage = () => {
  const { user, signIn, setIsLoading } = useStore();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  if (user?.token) window.location.replace("/");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const user = await getGoogleSignIn(tokenResponse.access_token);
      setIsLoading(false);

      if (user.success) {
        saveUserInfo(user, signIn);
      } else {
        toast.error("Something went wrong!, Try again.");
      }
    },

    onError: (error) => {
      console.log(error);
      toast.error("Login error, try again.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await emailLogin({ ...data });
    setIsLoading(false);

    if (result.success) {
      saveUserInfo(result, signIn);
    } else {
      toast.error(result?.message);
    }
  };

  return (
    <div className="flex w-full h-[100vh]">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center">
        <Logo type="login" />
        <span className="text-xl font-semibold text-white">Welcome, back!</span>
      </div>
      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#03132f] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full justify-center flex flex-col items-center py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden">
            <Logo />
          </div>
          <div className="max-w-md w-full space-y-8">
            <div className="">
              <h2 className="mt-6 text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                Sign in to your account.
              </h2>
            </div>
            <Button
              label="Sign in with Google"
              icon={<FcGoogle />}
              styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300"
              onClick={() => googleLogin()}
            />
            <Divider label="or sign in with email" />

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="flex flex-col rounded-md shadow-sm gap-5 -space-y-px">
                <InputBox
                  type="email"
                  label="Email Address"
                  placeholder="your@example.com"
                  name="email"
                  value={data?.email}
                  onChange={handleChange}
                  isRequired={true}
                />
                <InputBox
                  type="password"
                  label="Password"
                  placeholder="Password"
                  name="password"
                  value={data?.password}
                  onChange={handleChange}
                  isRequired={true}
                />
              </div>
              <Button
                label="Sign In"
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:rinf-offset-2 focus:ring-rose-500 mt-8"
              />
            </form>
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-rose-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default LoginPage;
