import useStore from "../store";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { formatNumber, getInitials } from "../utils";
import moment from "moment";
import { followersData } from "../utils/apiCalls";
import { Pagination } from "../components";

const Followers = () => {
  const { user, setIsLoading } = useStore();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);

  const [page, setPage] = useState(searchParams.get("page") || 1);

  const fetchStats = async () => {
    setIsLoading(true);
    const res = await followersData(page, user?.token);
    setIsLoading(false);
    setData(res);
  };

  useEffect(() => {
    fetchStats();
    //eslint-disable-next-line
  }, []);

  const handlePageChange = (val) => {
    setPage(val);
  };

  return (
    <div>
      <div className="w-full flex flex-col">
        <p className="text-slate-700 dark:text-white text-lg pb-1 font-semibold">
          Followers (
          <span className="text-sm">
            {data?.data?.length * data?.page +
              " of " +
              data?.total +
              " records"}
          </span>
          )
        </p>

        <table className="min-w-full border-collapse table">
          <thead className="table-header-group">
            <tr className="border border-gray-300 top-auto relative text-xs md:text-base">
              <th className="bg-gray-100 px-8 md:px-0 text-gray-600 font-bold table-cell"></th>
              <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                Name
              </th>
              <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                Account
              </th>
              <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                Followers
              </th>
              <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                Joined Date
              </th>
            </tr>
          </thead>
          <tbody className="table-row-group">
            {data?.data?.map(({ _id, followerId, createdAt }) => (
              <tr key={_id} className="table-row">
                <td className="p-2 table-cell">
                  {followerId?.image ? (
                    <img
                      src={followerId?.image}
                      alt="Follower"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <p className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-700 text-white">
                      {getInitials(followerId?.name)}
                    </p>
                  )}
                </td>
                <td className="p-2 border-l table-cell">
                  <p className="text-xs md:text-base">{followerId?.name}</p>
                </td>
                <td className="p-2 border-l table-cell">
                  <p
                    className={`${
                      followerId?.accountType === "User"
                        ? "bg-rose-800 text-rose-800"
                        : "bg-blue-800 text-blue-800"
                    } bg-opacity-30 px-4 py-1 rounded-full w-fit text-xs md:text-base`}
                  >
                    {followerId?.accountType}
                  </p>
                </td>
                <td className="p-2 border-l table-cell">
                  <div className="flex gap-1 items-center text-xs md:text-base">
                    {formatNumber(followerId?.followers.length ?? 0)}
                  </div>
                </td>
                <td className="p-2 border-l table-cell text-xs md:text-base">
                  {moment(createdAt).fromNow()}
                </td>
              </tr>
            ))}
          </tbody>

          {data?.data?.length < 1 && (
            <caption className="table-caption">No Data Found.</caption>
          )}
        </table>
      </div>
      <div className="w-full flex items-center justify-center">
        <Pagination totalPages={data?.page} onPageChange={handlePageChange} />
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Followers;
