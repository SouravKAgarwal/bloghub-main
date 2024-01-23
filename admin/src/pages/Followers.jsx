import useStore from "../store";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Pagination, Table } from "@mantine/core";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useFollowers } from "../hooks/followersHooks";
import { formatNumber, getInitials, updateUrl } from "../utils";
import { Loading } from "../components";
import moment from "moment";

const Followers = () => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [visible, { toggle }] = useDisclosure();
  const { data, isPending, mutate } = useFollowers(toast, toggle, user?.token);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    const fetchFollowers = () => {
      updateUrl({ page, navigate, location });
      mutate(page);
    };

    fetchFollowers();
  }, [page]);

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

        <Table highlightOnHover withRowBorders className="flex-1">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Account</Table.Th>
              <Table.Th>Followers</Table.Th>
              <Table.Th>Joined Date</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data?.data?.map(({ _id, followerId, createdAt }) => (
              <Table.Tr key={_id} className="dark:text-gray-400 text-slate-600">
                <Table.Td className="flex gap-2 items-center">
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
                </Table.Td>
                <Table.Td>
                  <p
                    className={`${
                      followerId?.accountType === "User"
                        ? "bg-rose-800 text-rose-800"
                        : "bg-blue-800 text-blue-800"
                    } bg-opacity-30 font-semibold px-4 py-1 rounded-full w-fit`}
                  >
                    {followerId?.accountType}
                  </p>
                </Table.Td>
                <Table.Td>
                  <div className="flex gap-1 items-center">
                    {formatNumber(followerId?.followers.length ?? 0)}
                  </div>
                </Table.Td>
                <Table.Td>{moment(createdAt).fromNow()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>

          {data?.data?.length < 1 && (
            <Table.Caption>No Data Found.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center bg-transparent">
          <Pagination
            classNames={{ control: "text-black dark:text-white" }}
            defaultValue={data?.page}
            total={data?.numOfPages}
            siblings={1}
            withEdges
            onChange={(value) => setPage(value)}
          />
        </div>
      </div>
      <Loading visible={isPending} />
      <Toaster richColors />
    </div>
  );
};

export default Followers;
