import { useEffect, useState } from "react";
import useStore from "../store";
import { Button } from "../components";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Profile from "../assets/profile.png";
import { deleteComment, getPostComment, postComment } from "../utils/apiCalls";

const PostComments = ({ postId }) => {
  const { user } = useStore();
  const [comments, setComments] = useState([]);
  const [data, setData] = useState({
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const fetchComments = async () => {
    const res = await getPostComment(postId);
    setComments(res);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();

    const res = await postComment(postId, user?.token, { ...data });

    if (res?.success) {
      setData({ desc: "" });
      toast.success("Comment published.");
      fetchComments();
    } else {
      toast.error("Something went wrong!");
    }
  };

  const handleDeleteComment = async (id) => {
    const res = await deleteComment(id, user?.token, postId);

    if (res?.success) {
      toast.success("Comment deleted.");
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  return (
    <div className="w-full py-10">
      <p className="text-lg text-slate-700 dark:text-slate-500 mb-6">
        Post Comments
      </p>

      {user?.token ? (
        <form className="flex flex-col mb-6" onSubmit={handlePostComment}>
          <textarea
            name="desc"
            value={data?.desc}
            required={true}
            placeholder="Add comment..."
            className="bg-transparent w-full p-2 border border-gray-300 focus:outline-none resize-none focus:border-blue-600 focus:ring-blue-600 rounded"
            onChange={handleChange}
          />
          <div className="flex w-full justify-end mt-2">
            <Button
              label="Submit"
              type="submit"
              onClick={() => {}}
              styles="bg-blue-600 text-white py-2 px-5 rounded"
            />
          </div>
        </form>
      ) : (
        <Link className="flex flex-col items-center py-10" to="/login">
          <Button
            label="Sign In to comment"
            styles="flex items-center justify-center bg-white dark:bg-rose-700 text-black dark:text-white px-4 py-2 rounded-full"
          />
        </Link>
      )}

      <div className="w-full h-full flex flex-col gap-10 2xl:gap-y-14 px-2">
        {comments?.length === 0 ? (
          <span className="text-base text-slate-600">
            No comments, be the first to comment.
          </span>
        ) : (
          comments?.map((el) => (
            <div key={el?._id} className="flex gap-4 items-start w-full">
              <img
                src={el?.user?.image || Profile}
                className="w-10 h-10 rounded-full"
                alt={el?.user?.name}
              />
              <div className="w-full -mt-2">
                <div className="w-full flex items-center gap-2">
                  <p className="font-medium text-slate-700 dark:text-slate-400">
                    {el?.user?.name}
                  </p>
                  <span className="italic text-xs text-slate-700">
                    {new Date(el?.createdAt).toDateString().slice(4)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">{el?.desc}</span>
                  {user?.user?._id === el?.user?._id && (
                    <span
                      className="text-base cursor-pointer text-red-600"
                      onClick={() => handleDeleteComment(el?._id)}
                    >
                      Delete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Toaster richColors />
    </div>
  );
};

export default PostComments;
