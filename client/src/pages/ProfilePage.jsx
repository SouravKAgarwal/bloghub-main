import { useParams } from "react-router-dom";
import UpdateForm from "../components/UpdateForm";
import { usePosts } from "../hooks/postHooks";
import { formatNumber } from "../utils";
import { getWriterInfo } from "../utils/apiCalls";
import { useEffect, useState } from "react";
import NoProfile from "../assets/profile.png";

const ProfilePage = () => {
  const { id } = useParams();
  const { posts } = usePosts({ writerId: id });

  const [profile, setProfile] = useState("");

  const fetchWriter = async () => {
    const res = await getWriterInfo(id);
    setProfile(res);
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
          {profile?.emailVerified ? (
            <div className="flex">
              <div className="flex items-center bg-green-500 rounded-full px-4 py-1.5">
                <p className="text-white font-semibold">Verified</p>
              </div>
            </div>
          ) : (
            <div className="flex">
              <div className="flex items-center bg-red-500 rounded-full px-4 py-1.5">
                <p className="text-white font-semibold">Verification Pending</p>
              </div>
            </div>
          )}
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
      <UpdateForm />
    </div>
  );
};

export default ProfilePage;
