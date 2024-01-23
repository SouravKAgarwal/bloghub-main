import { useEffect, useState } from "react";
import useStore from "../store";
import { useDisclosure } from "@mantine/hooks";
import { Graph, Loading, Stats } from "../components";
import { Toaster, toast } from "sonner";
import { useAnalytics } from "../hooks/postHooks";
import { Select } from "@mantine/core";

const Analytics = () => {
  const { user } = useStore();

  const [numOfDays, setNumOfDays] = useState(28);
  const [visible, { toggle }] = useDisclosure(false);

  const { data, isPending, mutate } = useAnalytics(toast, toggle, user?.token);

  useEffect(() => {
    mutate(numOfDays);
  }, [numOfDays]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-3">
        <p className="text-xl font-semibold text-slate-700 dark:text-white">
          Analytics
        </p>

        <Select
          label="Select range"
          defaultValue="28 days"
          placeholder="Range"
          data={["7 days", "28 days", "90 days", "365 days"]}
          onChange={(val) => setNumOfDays(val?.split(" ")[0])}
        />
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

      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Analytics;
