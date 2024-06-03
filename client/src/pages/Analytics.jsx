import { useEffect, useState } from "react";
import useStore from "../store";
import { Graph, Loading, Stats } from "../components";
import { Toaster, toast } from "sonner";
import { adminData } from "../utils/apiCalls";

const Analytics = () => {
  const { user, isLoading, setIsLoading } = useStore();
  const [numOfDays, setNumOfDays] = useState(28);
  const [data, setData] = useState(null);

  const fetchAnalytics = async (days) => {
    setIsLoading(true);
    const res = await adminData(days, user?.token);
    setData(res?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.token) {
      fetchAnalytics(numOfDays);
    }
  }, [numOfDays, user?.token]);

  const handleRangeChange = (event) => {
    setNumOfDays(event.target.value.split(" ")[0]);
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-3">
        <p className="text-xl font-semibold text-slate-700 dark:text-white">
          Analytics
        </p>

        <select
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
          onChange={handleRangeChange}
          value={`${numOfDays} days`}
        >
          <option value="7 days">7 days</option>
          <option value="28 days">28 days</option>
          <option value="90 days">90 days</option>
          <option value="365 days">365 days</option>
        </select>
      </div>

      <Stats dt={data} />

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium">
          View Stats for last {numOfDays} days
        </p>
        <Graph dt={data?.viewStats} />
      </div>

      <div className="w-full py-8">
        <p className="py-5 text-base font-medium">
          Follower Stats for last {numOfDays} days
        </p>
        <Graph dt={data?.followersStats} />
      </div>

      {isLoading && <Loading />}
      <Toaster richColors />
    </div>
  );
};

export default Analytics;
