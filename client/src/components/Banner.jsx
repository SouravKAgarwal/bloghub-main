import Markdown from "markdown-to-jsx";
import { Link } from "react-router-dom";

const Banner = ({ post }) => {
  return (
    <div className="w-full mb-10 transition-all duration-500">
      <div className="relative w-full h-[500px] 2xl:h-[600px] flex px-0 lg:px-20">
        <Link to={`/${post?.slug}/${post?._id}`} className="w-full">
          <img
            src={post?.img}
            className="w-full md:w-3/4 h-64 md:h-[420px] 2xl:h-[560px] rounded"
            alt="banner"
          />
        </Link>

        <div className="absolute flex flex-col md:right-10 bottom-10 md:bottom-2 w-full md:w-2/4 lg:w-1/3 2xl:w-[480px] bg-white dark:bg-[#05132b] shadow-2xl rounded-lg gap-3 p-4">
          <Link to={`/${post?.slug}/${post?._id}`}>
            <h1 className="font-semibold text-2xl text-black dark:text-white">
              {post?.title.slice(0, 60) + "...."}
            </h1>
          </Link>
          <div className="flex overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify">
            <Markdown options={{ wrapper: "article" }}>
              {post?.desc?.slice(0, 160) + "...."}
            </Markdown>
          </div>
          <Link
            to={`/${post?.slug}/${post?._id}`}
            className="w-fit bg-rose-600 bg-opacity-20 text-rose-700 px-4 py-1 rounded-full text-sm cursor-pointer"
          >
            Read More...
          </Link>

          <Link
            to={`/writer/${post?.user?._id}`}
            className="flex gap-3 items-center mt-4 "
          >
            <img
              src={post?.user?.image}
              className="object-cover w-10 h-10 rounded-full"
              alt="writer"
            />
            <span className="font-medium text-gray-700 dark:text-slate-400">
              {post?.user?.name}
            </span>
            <span className="text-gray-500 dark:text-gray-600">
              {new Date(post?.createdAt).toDateString()}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
