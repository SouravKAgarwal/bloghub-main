import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, InputBox } from "../components";
import { createSlug, uploadFile } from "../utils";
import { updatePost, getSinglePost } from "../utils/apiCalls";
import { BiUpload } from "react-icons/bi";
import Placeholder from "../assets/placeholder.png";
import useStore from "../store";
import { Toaster, toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditPost = () => {
  const { user, setIsLoading } = useStore();
  const { postId } = useParams();

  const [postData, setPostData] = useState([]);
  const [data, setData] = useState({
    title: "",
    cat: "",
    desc: "",
  });

  console.log(data);
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [progress, setProgress] = useState({});

  const navigate = useNavigate();

  const fetchPostData = async () => {
    const post = await getSinglePost(postId);
    setPostData(post);
  };

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  useEffect(() => {
    if (postData) {
      setData({
        title: postData?.title,
        cat: postData?.cat,
        desc: postData?.desc,
      });
      setFileUrls(postData?.img || []);
    } else {
      toast.error("Failed to fetch post data");
    }
  }, [postData]);

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
    if (files.length > 0) {
      files.forEach((file) => {
        uploadFile(
          (url) => setFileUrls((prev) => [...prev, url]),
          (prog) => setProgress((prev) => ({ ...prev, [file.name]: prog })),
          file
        );
      });
    }
  }, [files]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slug = createSlug(data?.title);

    const postData = {
      ...data,
      slug,
      img: fileUrls,
    };

    setIsLoading(true);

    const res = await updatePost(postId, postData, user?.token);

    setIsLoading(false);

    if (res?.success) {
      toast.success(res?.message);
    } else {
      toast.error(res.message);
    }

    setData({ title: "", desc: "", cat: "" });
    setFileUrls([]);
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
              value={data?.title}
              onChange={handleChange}
            />
            <InputBox
              label="Category"
              className="w-full md:flex-1"
              placeholder="Select Category"
              name="cat"
              value={data?.cat}
              onChange={handleChange}
              options={["FASHION", "NEWS", "CODING", "EDUCATION", "SPORTS"]}
            />
          </div>
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={data?.desc}
              onChange={handleDescChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ color: [] }, { background: [] }],
                ],
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "link",
                "image",
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
              onChange={handleFileChange}
              multiple
              className="hidden"
              data-max-size="5120"
              id="imgUpload"
              accept=".jpg,.png,.jpeg"
            />
            <div className="relative p-2">
              <img
                src={fileUrls.length > 0 ? fileUrls[0] : Placeholder}
                className="w-12 h-12 rounded-full object-cover"
                alt="profile"
              />
              {Object.keys(progress).length > 0 && (
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
                      strokeDashoffset={`calc(125.6 - (125.6 * ${Math.max(
                        ...Object.values(progress)
                      )}) / 100)`}
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
              {files.length > 0 ? (
                `${files.length} files selected`
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
          {fileUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              className="w-24 h-24 object-cover rounded"
              alt={`upload-${index}`}
            />
          ))}
        </div>
        <Button
          label="Update Post"
          type="submit"
          styles="mt-4 py-2 bg-rose-600 text-white rounded-full"
        />
      </form>
      <Toaster richColors />
    </div>
  );
};

export default EditPost;
