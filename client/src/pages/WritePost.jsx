import { useEffect, useState } from "react";
import { Button, InputBox } from "../components";
import { createSlug, uploadFile } from "../utils";
import { BiUpload } from "react-icons/bi";
import Placeholder from "../assets/placeholder.png";
import useStore from "../store";
import { createPost } from "../utils/apiCalls";
import { Toaster, toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const WritePost = () => {
  const { user, setIsLoading } = useStore();
  const [data, setData] = useState({
    title: "",
    cat: "",
    desc: "",
  });

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleDescChange = (value) => {
    setData({ ...data, desc: value });
  };

  useEffect(() => {
    if (file) {
      uploadFile(setFileUrl, setProgress, file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slug = createSlug(data?.title);

    const postData = {
      ...data,
      slug,
      img: fileUrl,
    };

    setIsLoading(true);

    const res = await createPost(postData, user?.token);

    setIsLoading(false);

    if (res?.success) {
      toast.success(res?.message);
    } else {
      toast.error(res.message);
    }

    setData({ title: "", cat: "", desc: "" });
    setFileUrl("");
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-3">
        <div className="w-full flex flex-col gap-5 mb-8">
          <div className="w-full flex flex-col md:flex-row gap-5">
            <InputBox
              label="Post Title"
              className="w-full md:flex-1"
              placeholder="Post Title"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
            <InputBox
              label="Category"
              className="w-full md:flex-1"
              placeholder="Select Category"
              name="cat"
              value={data.cat}
              onChange={handleChange}
              options={["FASHION", "NEWS", "CODING", "EDUCATION", "SPORTS"]}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="text-slate-900 dark:text-white">
              Description
            </label>
            <ReactQuill
              theme="snow"
              className="text-black dark:text-white"
              value={data.desc}
              onChange={handleDescChange}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  [{ color: [] }, { background: [] }],
                ],
              }}
              formats={[
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "link",
                "color",
                "background",
              ]}
            />
          </div>
          <label
            htmlFor="imgUpload"
            className="w-fit flex mt-2 items-center gap-1 text-base cursor-pointer dark:text-gray-500 text-gray-700"
          >
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              data-max-size="5120"
              id="imgUpload"
              accept=".jpg,.png,.jpeg"
            />
            <div className="relative p-2">
              <img
                src={fileUrl || Placeholder}
                className="w-12 h-12 rounded-full object-cover"
                alt="profile"
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
                `1 file selected`
              ) : (
                <span className="flex items-center gap-1">
                  Upload
                  <BiUpload size={15} />
                </span>
              )}
            </span>
          </label>
        </div>
        <div className="w-full flex flex-wrap gap-3">
          {fileUrl && (
            <img
              src={fileUrl}
              className="w-24 h-24 object-cover rounded"
              alt={`${file}`}
            />
          )}
        </div>
        <Button
          label="Create Post"
          type="submit"
          styles="mt-4 py-2 bg-rose-600 text-white rounded-full"
        />
      </form>
      <Toaster richColors />
    </div>
  );
};

export default WritePost;
