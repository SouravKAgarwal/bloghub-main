import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useStore from "../store";
import { PopularPost, PopularWriters, PostComments } from "../components";
import Markdown from "markdown-to-jsx";
import { getSinglePost } from "../utils/apiCalls";
import { usePopularPosts } from "../hooks/postHooks";

const BlogDetails = () => {
  const { setIsLoading } = useStore();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const popular = usePopularPosts();

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
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
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
            <Markdown
              options={{ wrapper: "article" }}
              className="leading-[3rem] text-base 2xl:text-[20px]"
            >
              {post?.desc}
            </Markdown>
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
    </div>
  );
};

export default BlogDetails;
