import { useDisclosure } from "@mantine/hooks";
import useStore from "../store";
import { useEffect } from "react";
import { useAnalytics } from "../hooks/postHooks";
import { Toaster, toast } from "sonner";
import { Graph, Loading, Stats } from "../components";
import { RecentFollowersTable, RecentPostTable } from "../components/Table";

const Dashboard = () => {
  const { user } = useStore();
  const [visible, { toggle }] = useDisclosure(false);

  const { data, isPending, mutate } = useAnalytics(toast, toggle, user?.token);

  useEffect(() => {
    mutate();
  }, []);

  return (
    <div className="w-full">
      <Stats dt={data} />
      <div className="w-full py-8">
        <p className="py-5 text-base font-medium">
          View Stats for last 28 days
        </p>
        <Graph dt={data?.viewStats} />
      </div>

      <div className="flex gap-6 flex-col md:flex-row py-6">
        {/* recent followers */}
        <div className="w-full md:w-1/3 flex flex-col">
          <span className="py-5 text-base font-medium dark:text-white text-slate-600">
            Recent Followers
          </span>
          <RecentFollowersTable data={data?.last5Followers} />
        </div>

        {/* recent 5 content */}
        <div className="w-full md:w-2/3 flex flex-col">
          <span className="py-5 text-base font-medium dark:text-white text-slate-600">
            Recent 5 Contents
          </span>
          <RecentPostTable data={data?.last5Posts} />
        </div>
      </div>

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Dashboard;
