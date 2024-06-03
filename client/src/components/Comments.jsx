import { useEffect } from "react";
import useCommentStore from "../store/commentStore";
import useStore from "../store";
import { useComments, useDeleteComment } from "../hooks/postHooks";
import NoProfile from "../assets/profile.png";

const Comments = () => {
  const { openComment, commentId, setOpen } = useCommentStore();
  const { user } = useStore();
  const { data, fetchComment } = useComments();
  const { deleteComment } = useDeleteComment(user?.token);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    deleteComment({ id, postId: commentId });
    setOpen(false);
  };

  useEffect(() => {
    fetchComment(commentId);
  }, [commentId]);

  if (!openComment) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Comments ({data?.data?.length})
        </h2>
        <div className="w-full h-full pb-6">
          <div className="w-full h-full flex flex-col gap-6 px-2">
            {data?.data?.map(({ _id, user, desc, post, createdAt }) => (
              <div key={_id} className="w-full flex gap-4">
                <img
                  src={user?.image || NoProfile}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Profile"
                />
                <div className="w-full">
                  <div className="w-full flex justify-between">
                    <div className="w-full flex items-center gap-2">
                      <p className="text-slate-600 font-medium">{user?.name}</p>
                      <span className="text-slate-700 text-xs italic">
                        {new Date(createdAt).toDateString()}
                      </span>
                    </div>
                    <span
                      className="text-sm text-red-600 cursor-pointer"
                      onClick={() => handleDelete(_id)}
                    >
                      Delete
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Comments;
