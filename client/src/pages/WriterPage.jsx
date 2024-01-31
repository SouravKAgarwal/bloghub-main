import { useParams } from "react-router-dom";
import useStore from "../store";
import { FaUserCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Pagination,
  PopularPost,
  PopularWriters,
} from "../components";
import { formatNumber } from "../utils";
import { usePopularPosts, usePosts } from "../hooks/postHooks";
import { followWriter, getWriterInfo, unFollowWriter } from "../utils/apiCalls";

const WriterPage = () => {
  const { user } = useStore();
  const { id } = useParams();

  const { posts, setPage, numOfPages } = usePosts({ writerId: id });
  const popular = usePopularPosts();

  const [writer, setWriter] = useState(null);

  const handlePageChange = (val) => {
    setPage(val);
  };

  const fetchWriter = async () => {
    const res = await getWriterInfo(id);
    setWriter(res);
  };

  const handleFollow = async () => {
    const res = await followWriter(id, user?.token);
    if (res?.success) {
      fetchWriter();
    }
  };

  const handleUnFollow = async () => {
    const res = await unFollowWriter(id, user?.token);
    if (res?.success) {
      fetchWriter();
    }
  };

  const followerIds = writer?.followers?.map((f) => f.followerId);

  useEffect(() => {
    fetchWriter();
    // eslint-disable-next-line
  }, [id]);

  if (!writer) {
    return (
      <div className="w-full h-full py-8 flex items-center justify-center">
        <span className="text-lg text-slate-500">No Writer Found!</span>
      </div>
    );
  }
  return (
    <div className="px-0 2xl:px-20">
      <div className="w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-black dark:bg-gradient-to-r from-[#020b19] via-[#071b3e] to-[#020b19] mt-5 mb-10 rounded-md p-5 md:px-20">
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src={writer?.image}
            className="w-48 h-48 rounded-full object-cover border border-slate-400"
            alt={writer?.name}
          />
        </div>
        <div className="w-full h-full flex flex-col gap-y-5 md:gap-y-8 items-center justify-center">
          <h2 className="text-white text-2xl 2xl:text-3xl font-bold">
            {writer?.name}
          </h2>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-2xl font-semibold">
                {formatNumber(writer?.followers?.length ?? 0)}
              </p>
              <span className="text-gray-500">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-2xl font-semibold">
                {formatNumber(posts?.length ?? 0)}
              </p>
              <span className="text-gray-500">Posts</span>
            </div>
          </div>

          {user?.token && (
            <div>
              {!followerIds?.includes(user?.user?._id) ? (
                <Button
                  label="Follow"
                  onClick={() => handleFollow()}
                  styles="text-slate-800 font-semibold md:-mt-4 px-6 py-1 rounded-full bg-white"
                />
              ) : (
                <Button
                  styles="text-white font-semibold md:-mt-4 px-6 py-1 rounded-full border bg-red-600"
                  onClick={() => handleUnFollow()}
                  label="Following"
                  icon={<FaUserCheck />}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col md:flex-row gap-10 2xl:gap-20">
        <div className="w-full md:w-2/3 gap-10 flex flex-col">
          {posts?.length === 0 ? (
            <div className="w-full h-full px-8 flex place-items-center justify-center">
              <span className="text-lg text-slate-500">
                No posts available!
              </span>
            </div>
          ) : (
            <>
              {posts?.map((post, index) => (
                <Card key={post?._id} post={post} index={index} />
              ))}

              <div className="w-full flex items-center justify-center">
                <Pagination
                  totalPages={numOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          <PopularPost posts={popular?.posts} />
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
    </div>
  );
};

export default WriterPage;
