// Stats.js
import React from "react";
import { BsEye, BsPostcardHeart } from "react-icons/bs";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { formatNumber } from "../utils";

const icons = {
  user: FaUsersCog,
  view: BsEye,
  post: BsPostcardHeart,
  users: FaUsers,
};

const Stats = ({ dt }) => {
  const data = [
    {
      title: "TOTAL POST",
      icon: "post",
      value: formatNumber(dt?.totalPosts ?? 0),
    },
    {
      title: "FOLLOWERS",
      icon: "users",
      value: formatNumber(dt?.followers ?? 0),
    },
    {
      title: "TOTAL VIEWS",
      icon: "view",
      value: formatNumber(dt?.totalViews ?? 0),
    },
    {
      title: "TOTAL WRITERS",
      icon: "user",
      value: formatNumber(dt?.totalWriters ?? 0),
    },
  ];

  const stats = data?.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <div className="border p-4" key={stat.title}>
        <div className="flex justify-between">
          <p className="capitalize text-sm">{stat.title}</p>
          <Icon size="1.4rem" />
        </div>
        <div className="mt-4">
          <p className="text-2xl font-serif">{stat.value}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Compare to previous month</p>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats}
    </div>
  );
};

export default Stats;
