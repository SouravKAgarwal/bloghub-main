import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { BiImages, BiUpload } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Logo, Button, Divider, InputBox } from "../components";
import { getGoogleSignUp, emailSignUp } from "../utils/apiCalls";
import useStore from "../store";
import { saveUserInfo, uploadFile } from "../utils";

const SignupPage = () => {
  const { user, signIn, setIsLoading } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const navigate = useNavigate();

  if (user?.token) window.location.replace(`/verify/${user?.user?._id}`);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const user = await getGoogleSignUp(tokenResponse.access_token);
      setIsLoading(false);

      if (user.success) {
        saveUserInfo(user, signIn);
      } else {
        toast.error(user?.message);
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await emailSignUp({
      ...data,
      image: fileUrl,
    });
    setIsLoading(false);

    if (result.success) {
      saveUserInfo(result, signIn);
      // navigate(`/verify/${user?.user?._id}`);
    } else {
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    file && uploadFile(setFileUrl, file);
  }, [file]);

  return (
    <div className="flex w-full h-[100vh] transition-all duration-500">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black items-center justify-center">
        {fileUrl && (
          <img
            src={fileUrl || file}
            className="w-16 h-16 rounded-full"
            alt=""
          />
        )}
        <Logo type="register" />
        <span className="text-xl font-semibold text-white">Hey, there!</span>
      </div>
      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#03132f] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full w-full justify-center flex flex-col items-center  py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden -ml-8">
            <Logo />
          </div>
          <div className="w-full space-y-6 flex flex-col justify-center">
            <div className="max-w-md w-full flex gap-3 md:gap-4 items-center justify-center mb-6">
              {showForm && (
                <IoArrowBackCircleSharp
                  className="text-2xl lg:text-3xl cursor-pointer text-gray-800 dark:text-gray-400"
                  onClick={() => setShowForm(false)}
                />
              )}
              <h2 className="text-center text-md sm:text-2xl lg:text-lg xl:text-3xl font-semibold text-gray-900 dark:text-white">
                Sign up for your account.
              </h2>
            </div>
            {showForm ? (
              <form
                className="max-w-md w-full space-y-2"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col rounded-md shadow-sm space-y-px gap-6 mb-4">
                  <div className="w-full flex gap-4">
                    <InputBox
                      type="text"
                      label="First Name"
                      placeholder="Firstname"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleChange}
                      isRequired={true}
                    />
                    <InputBox
                      type="text"
                      label="Last Name"
                      placeholder="Lastname"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleChange}
                      isRequired={true}
                    />
                  </div>
                  <InputBox
                    type="email"
                    label="Email Address"
                    placeholder="your@example.com"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <InputBox
                    type="password"
                    label="Password"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    isRequired={true}
                  />
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="imgUpload"
                      className="flex items-center gap-1 text-base text-black dark:text-gray-500 cursor-pointer py-2"
                    >
                      <input
                        id="imgUpload"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        data-max-size="1024"
                        accept=".jpg,.jpeg,.png"
                      />
                      <BiImages />

                      <span>
                        {file ? (
                          file.name
                        ) : (
                          <span className="flex gap-1 items-center">
                            Upload <BiUpload />
                          </span>
                        )}
                      </span>
                    </label>
                  </div>
                </div>
                {file ? (
                  <Button
                    label="Create Account"
                    type="submit"
                    styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
                  />
                ) : (
                  <Button
                    label="Create Account"
                    type="submit"
                    styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-300 hover:bg-rose-700 focus:outline-none cursor-not-allowed"
                  />
                )}
              </form>
            ) : (
              <div className="max-w-md w-full space-y-8">
                <Button
                  label="Sign up with Google"
                  icon={<FcGoogle />}
                  styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300"
                  onClick={() => googleLogin()}
                />
                <Divider label="or" />
                <Button
                  label="Continue with email"
                  styles="w-full gap-4 bg-white text-black dark:bg-rose-800 dark:text-white px-5 py-2.5 rounded-full border dark:border-none border-gray-300"
                  onClick={() => setShowForm(true)}
                />
              </div>
            )}

            <p className="max-w-md w-full text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-rose-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default SignupPage;
