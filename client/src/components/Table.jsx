// Table.js
import React from "react";
import moment from "moment";
import { formatNumber, getInitials } from "../utils";

export const RecentFollowersTable = ({ data }) => {
  const tableData = data?.map(({ _id, createdAt, followerId: follower }) => (
    <tr key={_id} className="text-black dark:text-gray-400">
      <td className="flex gap-2 items-center py-2">
        {follower?.image ? (
          <img
            src={follower?.image}
            alt={follower?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <p className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-200 text-gray-500">
            {getInitials(follower?.name)}
          </p>
        )}
        <p className="text-xs">{follower?.name}</p>
      </td>
      <td className="py-2">
        <span className="text-xs text-red-600">{follower?.accountType}</span>
      </td>
      <td className="py-2">
        <span className="text-sm font-bold">
          {formatNumber(follower?.followers.length)}
        </span>
      </td>
      <td className="py-2">
        <p className="text-xs">{moment(createdAt).fromNow()}</p>
      </td>
    </tr>
  ));

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="py-2 border-b">Follower</th>
          <th className="py-2 border-b">User Type</th>
          <th className="py-2 border-b">Followers</th>
          <th className="py-2 border-b">Since</th>
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
      {data?.length === 0 && (
        <caption className="text-center py-4">No data found.</caption>
      )}
    </table>
  );
};

export const RecentPostTable = ({ data }) => {
  const tableData = data?.map((el) => (
    <tr key={el?._id} className="text-black dark:text-gray-400">
      <td className="flex gap-2 items-center py-2">
        <img
          src={el?.img}
          alt={el?.title}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-xs">{el?.title}</p>
      </td>
      <td className="py-2">
        <span className="text-xs text-red-600">{el?.cat}</span>
      </td>
      <td className="py-2">{formatNumber(el?.views.length)}</td>
      <td className="py-2">
        <p className="text-xs">{moment(el?.createdAt).fromNow()}</p>
      </td>
    </tr>
  ));

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="py-2 border-b">Post Title</th>
          <th className="py-2 border-b">Category</th>
          <th className="py-2 border-b">Views</th>
          <th className="py-2 border-b">Post Date</th>
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
      {data?.length === 0 && (
        <caption className="text-center py-4">No data found.</caption>
      )}
    </table>
  );
};
