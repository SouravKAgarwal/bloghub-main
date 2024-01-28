import { useState, useEffect } from "react";
import { BiImages, BiUpload } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Button, InputBox } from "../components";
import { getWriterInfo, updateUser } from "../utils/apiCalls";
import useStore from "../store";
import NoProfile from "../assets/profile.png";
import { saveUserInfo, uploadFile } from "../utils";
import { useParams } from "react-router-dom";

const UpdateForm = () => {
  const { user, signIn, setIsLoading } = useStore();
  const { id } = useParams();

  const [profile, setProfile] = useState("");

  const fetchWriter = async () => {
    const res = await getWriterInfo(id);
    setProfile(res);
  };

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateUser(user?.token, {
      ...data,
      image: fileUrl,
    });

    setIsLoading(false);

    setData({ firstName: "", lastName: "" });
    setFile("");

    if (res?.success) {
      saveUserInfo(res, signIn);
      fetchWriter();
      toast.success(res?.message);
    }
  };

  useEffect(() => {
    file && uploadFile(setFileUrl, file);
    fetchWriter();
  }, [file, id]);

  return (
    <div className="flex justify-center h-full">
      <div className="h-full justify-center flex flex-col items-center py-12 px-4 sm:px-0 lg:px-8">
        <div className="w-full space-y-6 flex flex-col justify-center">
          <form className="max-w-md w-full space-y-2" onSubmit={handleSubmit}>
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
              <div className="w-full flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-slate-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="dark:bg-transparent appearance-none block w-full px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base"
                  name="email"
                  value={profile?.email || ""}
                  readOnly
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-2 text-base text-black dark:text-gray-500 cursor-pointer py-2"
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
                  {fileUrl ? (
                    <img
                      src={fileUrl}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={profile?.image === "" ? NoProfile : profile?.image}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}

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

            <Button
              label="Update Account"
              type="submit"
              styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
              onClick={() => {
                !file && toast.error("Upload Image!");
              }}
            />
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default UpdateForm;
