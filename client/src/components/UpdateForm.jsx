import { useState, useEffect } from "react";
import { BiUpload } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Button, InputBox } from "../components";
import { deleteUser, updateUser } from "../utils/apiCalls";
import useStore from "../store";
import NoProfile from "../assets/profile.png";
import { saveUserInfo, uploadFile } from "../utils";
import { useParams } from "react-router-dom";

const UpdateForm = ({ profile, fetchWriter }) => {
  const { user, signIn, setIsLoading, signOut } = useStore();
  const { id } = useParams();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [pass, setPass] = useState("");
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (profile) {
      const [firstName, lastName] = profile.name
        ? profile.name.split(" ")
        : ["", ""];
      setData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: profile.email || "",
      });
      setPass("");
      setFileUrl(profile.image || "");
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile?.accountType === "Google") {
      setIsLoading(true);
      const res = await updateUser(user?.token, {
        ...data,
        image: fileUrl,
      });
      setIsLoading(false);

      if (res?.success) {
        localStorage.removeItem("userInfo");
        saveUserInfo(res, signIn);
        toast.success(res?.message);
        fetchWriter();
      }
    } else {
      setIsLoading(true);
      const res = await updateUser(user?.token, {
        ...data,
        password: pass,
        image: fileUrl,
      });

      setIsLoading(false);

      if (res?.success) {
        localStorage.removeItem("userInfo");
        saveUserInfo(res, signIn);
        toast.success(res?.message);
        fetchWriter();
      }
    }

    setData({ firstName: "", lastName: "", email: "" });
    setPass("");
    setFile("");
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await deleteUser(id, user?.token);

    setIsLoading(false);

    if (res?.success) {
      toast.success(res?.message);
      localStorage.removeItem("userInfo");
      signOut();
    }
  };

  useEffect(() => {
    if (file) {
      uploadFile(setFileUrl, setProgress, file);
    }
  }, [file]);

  return (
    <div className="flex justify-center h-full">
      <div className="h-full justify-center flex flex-col items-center py-12 px-4 sm:px-0 lg:px-8">
        <div className="w-full space-y-6 flex flex-col justify-center">
          <form className="max-w-md w-full space-y-2">
            <div className="flex flex-col rounded-md shadow-sm space-y-px gap-6 mb-4">
              <div className="w-full flex gap-4">
                <InputBox
                  type="text"
                  label="Firstname"
                  placeholder="Firstname"
                  name="firstName"
                  value={data.firstName}
                  onChange={handleChange}
                  isRequired={true}
                />
                <InputBox
                  type="text"
                  label="Lastname"
                  placeholder="Lastname"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleChange}
                  isRequired={true}
                />
              </div>
              <div className="w-full flex flex-col gap-6">
                <InputBox
                  type="email"
                  label="Email Address"
                  placeholder="Email"
                  name="email"
                  value={data?.email}
                  onChange={handleChange}
                  isRequired={true}
                />
                {profile?.provider === "Authorised" && (
                  <InputBox
                    type="password"
                    label="Password"
                    placeholder="Enter new password"
                    name="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    isRequired={true}
                  />
                )}
              </div>

              <div className="flex items-center justify-between relative ">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-2 text-base text-black dark:text-gray-500 cursor-pointer py-2 relative"
                >
                  <input
                    id="imgUpload"
                    name="imgUpload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    data-max-size="1024"
                    accept=".jpg,.jpeg,.png"
                    required
                  />
                  <div className="relative p-2">
                    <img
                      src={fileUrl || NoProfile}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={profile?.name}
                    />
                    {progress !== null && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-14 w-14">
                          <circle
                            className="text-gray-300"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="24"
                            cx="29"
                            cy="29"
                          />
                          <circle
                            className="text-black"
                            strokeWidth="3"
                            strokeDasharray="125.6"
                            strokeDashoffset={`calc(125.6 - (125.6 * ${progress}) / 100)`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="24"
                            cx="29"
                            cy="29"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
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

            <div className="flex gap-4">
              <Button
                label="Update"
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
                onClick={handleSubmit}
              />
              <Button
                label="Delete Account"
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-rose-800 focus:outline-none"
                onClick={handleDelete}
              />
            </div>
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default UpdateForm;
