import React, { useEffect, useState } from "react";
import useStore from "../store";
import { Toaster } from "sonner";
import {
  Graph,
  Stats,
  RecentFollowersTable,
  RecentPostTable,
} from "../components";
import { adminData } from "../utils/apiCalls";

const Dashboard = () => {
  const { user, setIsLoading } = useStore();
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    const res = await adminData(7, user?.token);
    setIsLoading(false);
    setData(res?.data);
  };

  useEffect(() => {
    fetchStats();
    //eslint-disable-next-line
  }, []);


  return (
    <div className="w-full p-4">
      <Stats dt={data} />
      <div className="w-full py-8">
        <p className="py-5 text-base font-medium">
          View Stats for last 28 days
        </p>
        <Graph dt={data?.viewStats} />
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-6">
        <div className="w-full flex flex-col">
          <span className="py-5 text-base font-medium text-slate-600">
            Recent Followers
          </span>
          <RecentFollowersTable data={data?.last5Followers} />
        </div>
        <div className="w-full flex flex-col">
          <span className="py-5 text-base font-medium text-slate-600">
            Recent Contents
          </span>
          <RecentPostTable data={data?.last5Posts} />
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default Dashboard;
