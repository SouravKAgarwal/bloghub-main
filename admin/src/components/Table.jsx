import { Table } from "@mantine/core";
import { formatNumber, getInitials } from "../utils";
import moment from "moment";

export const RecentFollowersTable = ({ data }) => {
  const tableData = data?.map(({ _id, createdAt, followerId: follower }) => (
    <Table.Tr key={_id} className="dark:text-gray-400 text-slate-600">
      <Table.Td className="flex gap-2 items-center">
        {follower?.image ? (
          <img
            src={follower?.image}
            alt={follower?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <p className="w-10 h-10 rounded-full flex justify-center items-center bg-transparent text-black">
            {getInitials(follower?.name)}
          </p>
        )}

        <p className="text-xs">{follower?.name}</p>
      </Table.Td>
      <Table.Td>
        <span className="text-xs text-rose-600">{follower?.accountType}</span>
      </Table.Td>

      <Table.Td>
        <span className="text-sm text-slate-600 font-bold">
          {formatNumber(follower?.followers.length)}
        </span>
      </Table.Td>

      <Table.Td>
        <p className="text-xs">{moment(createdAt).fromNow()}</p>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withColumnBorders withRowBorders withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Follower</Table.Th>
          <Table.Th>User Type</Table.Th>
          <Table.Th>Followers</Table.Th>
          <Table.Th>Join Date</Table.Th>
        </Table.Tr>
      </Table.Thead>

      {data?.length === 0 && <Table.Caption>No data found.</Table.Caption>}

      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};

export const RecentPostTable = ({ data }) => {
  const tableData = data?.map((el) => (
    <Table.Tr key={el?._id} className="dark:text-gray-400 text-slate-600">
      <Table.Td className="flex gap-2 items-center">
        <img
          src={el?.img}
          alt={el?.title}
          className="w-10 h-10 rounded-full object-cover"
        />

        <p className="text-xs">{el?.title}</p>
      </Table.Td>

      <Table.Td>
        <span className="text-[10px] text-rose-600">{el?.cat}</span>
      </Table.Td>

      <Table.Td>{formatNumber(el?.views.length)}</Table.Td>
      <Table.Td>
        <p className="text-xs">{moment(el?.createdAt).fromNow()}</p>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover withColumnBorders withRowBorders withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Post Title</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Views</Table.Th>
          <Table.Th>Post Date</Table.Th>
        </Table.Tr>
      </Table.Thead>

      {data?.length === 0 && <Table.Caption>No data found.</Table.Caption>}

      <Table.Tbody>{tableData}</Table.Tbody>
    </Table>
  );
};
