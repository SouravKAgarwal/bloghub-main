import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../store";
import { PopularPost, PopularWriters, PostComments } from "../components";
import Markdown from "markdown-to-jsx";
import { deletePost, getSinglePost } from "../utils/apiCalls";
import { usePopularPosts } from "../hooks/postHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { Toaster, toast } from "sonner";

const BlogDetails = () => {
  const { user, setIsLoading } = useStore();
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const popular = usePopularPosts();

  const navigate = useNavigate();

  const handleDeletePost = async () => {
    setIsLoading(true);
    const res = await deletePost(id, user?.token);
    setIsLoading(false);

    if (res?.success) {
      toast.success(res?.message);
      navigate("/");
    } else {
      toast.error(res?.message);
    }
  };
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      const data = await getSinglePost(id);

      setPost(data || []);
      setIsLoading(false);
    };
    if (id) {
      fetchPost();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line
  }, [id]);

  if (!post) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-xl text-slate-500">Loading....</span>
      </div>
    );
  }

  return (
    <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
      <div className="flex w-full flex-col-reverse md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="flex items-center gap-2 text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {post?.title}
          </h1>
          <div className="w-full flex items-center">
            <span className="flex-1 text-rose-600 font-semibold">
              {post?.cat}
            </span>
            <span className="flex flex-1 items-baseline text-2xl font-medium text-slate-700 dark:text-slate-400">
              {post?.views?.length}
              <span className="text-base text-rose-600">Views</span>
            </span>
            <span className="flex flex-1 text-2xl font-semibold">
              {post?.user?._id === user?.user?._id && (
                <div className="flex gap-2">
                  <BiPencil onClick={() => navigate(`/edit/${id}`)} className="text-black dark:text-white" />
                  <BiTrash onClick={handleDeletePost} className="text-red-600" />
                </div>
              )}
            </span>
          </div>
        </div>

        <img
          src={post?.img}
          className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-cover "
          alt={post?.title}
        />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 mt-10">
        <div className="w-full md:w-2/3 flex flex-col text-black dark:text-gray-400">
          {post?.desc && (
            <Markdown className="leading-[2.25rem]">{post?.desc}</Markdown>
          )}

          <div className="w-full">
            <PostComments postId={id} />
          </div>
        </div>
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          <PopularPost posts={popular?.posts} />
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default BlogDetails;
