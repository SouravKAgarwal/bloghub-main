import { Link, useParams } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
import { usePopularPosts, usePosts } from "../hooks/postHooks";
import { formatNumber } from "../utils";
import { getWriterInfo, resendOTP } from "../utils/apiCalls";
import { useEffect, useState } from "react";
import NoProfile from "../assets/profile.png";
import { toast } from "sonner";
import { BiArrowToRight } from "react-icons/bi";
import {
  Button,
  Card,
  Pagination,
  PopularPost,
  PopularWriters,
} from "../components";

const ProfilePage = () => {
  const { id } = useParams();
  const { posts, setPage, numOfPages } = usePosts({ writerId: id });
  const popular = usePopularPosts();

  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState("");

  const handleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  const handlePageChange = (val) => {
    setPage(val);
  };

  const fetchWriter = async () => {
    const res = await getWriterInfo(id);
    setProfile(res);
  };

  const handleResendOTP = async () => {
    const response = await resendOTP(id);

    if (response.success) {
      toast.success("OTP sent successfully");
    } else {
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    fetchWriter();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="px-0 2xl:px-20">
      <div className="w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-black dark:bg-gradient-to-r from-[#020b19] via-[#071b3e] to-[#020b19] mt-5 mb-10 rounded-md p-5 md:px-20">
        <div className="w-full md:w-1/3 flex justify-center">
          {profile?.image ? (
            <img
              src={profile?.image}
              className="w-48 h-48 rounded-full"
              alt="profile"
            />
          ) : (
            <img
              src={NoProfile}
              className="w-48 h-48 rounded-full"
              alt="noprofile"
            />
          )}
        </div>
        <div className="w-full h-full flex flex-col gap-y-5 items-center justify-center">
          <h2 className="text-white text-2xl 2xl:text-3xl font-bold">
            {profile?.name}
          </h2>
          <span className="text-sm text-gray-500 -mt-4">
            {profile?.accountType}
          </span>
          <div className="flex gap-4">
            {profile?.emailVerified ? (
              <div className="flex">
                <div className="flex items-center bg-green-500 rounded-full px-4 py-1.5">
                  <p className="text-white font-semibold">Verified</p>
                </div>
              </div>
            ) : (
              <div className="flex">
                <div className="flex items-center bg-red-500 rounded-full px-4 py-1.5">
                  <Link
                    className="flex gap-2 items-center text-white font-semibold"
                    onClick={handleResendOTP}
                    to={`/verify/${id}`}
                  >
                    Verification Pending
                    <BiArrowToRight className="text-xl" />
                  </Link>
                </div>
              </div>
            )}
            {profile?.accountType === "Writer" && (
              <Button
                label="Edit Profile"
                styles="gap-4 bg-white text-black dark:bg-rose-800 dark:text-white px-5 py-2.5 rounded-full border dark:border-none border-gray-300"
                onClick={handleShowForm}
              />
            )}
          </div>
          {profile?.accountType === "Writer" ? (
            <div className="flex gap-10">
              <div className="flex flex-col items-center">
                <p className="text-gray-300 text-2xl font-semibold">
                  {formatNumber(profile?.followers?.length ?? 0)}
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
          ) : (
            <div className="flex gap-10">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">Joined Date :</p>
                <span className="text-gray-500">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col md:flex-row gap-10 2xl:gap-20">
        {profile?.accountType === "User" ? (
          <>
            <div className="w-full md:w-2/3">
              <UpdateForm profile={profile} fetchWriter={fetchWriter} />
            </div>

            <div className="w-full md:w-1/4 flex flex-col gap-y-12">
              <PopularPost posts={popular?.posts} />
              <PopularWriters data={popular?.writers} />
            </div>
          </>
        ) : (
          <div className="w-full">
            {showForm && (
              <UpdateForm profile={profile} fetchWriter={fetchWriter} />
            )}
          </div>
        )}
      </div>

      {profile?.accountType === "Writer" && (
        <div className="flex w-full flex-col md:flex-row gap-10 2xl:gap-20 mt-16">
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
      )}
    </div>
  );
};

export default ProfilePage;
