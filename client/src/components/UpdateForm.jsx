import { useState, useEffect } from "react";
import { BiImages, BiUpload } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import { Button, InputBox } from "../components";
import { updateUser } from "../utils/apiCalls";
import useStore from "../store";
import { saveUserInfo, uploadFile } from "../utils";

const UpdateForm = ({ profile }) => {
  const { user, signIn, setIsLoading } = useStore();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
  });

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateUser(user?.token, { ...data, image: fileUrl });

    setIsLoading(false);

    if (result.success) {
      saveUserInfo(result, signIn);
    } else {
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    file && uploadFile(setFileUrl, file);
  }, [file]);

  return (
    <div className="flex justify-center h-full bg-white dark:bg-[#020b19] items-center">
      <div className="h-full justify-center flex flex-col items-center py-12 px-4 sm:px-0 lg:px-8">
        <div className="w-full space-y-6 flex flex-col justify-center">
          <form className="max-w-md w-full space-y-2" onSubmit={handleSubmit}>
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
                value={profile?.email}
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

            <Button
              label="Update Account"
              type="submit"
              styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
            />
          </form>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default UpdateForm;
