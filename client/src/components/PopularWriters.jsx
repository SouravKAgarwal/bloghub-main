import { Link } from "react-router-dom";
import Profile from "../assets/profile.png";
import { formatNumber } from "../utils";

const PopularWriters = ({ data }) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="text-xl font-bold -mb-3 text-gray-600 dark:text-slate-500">
        Popular Writers
      </div>

      {data?.map((el) => (
        <Link
          to={`/writer/${el?._id}`}
          className="flex gap-2 items-center"
          key={el?._id}
        >
          <img
            src={el?.img || Profile}
            alt={el?.name}
            className="h-12 w-12 object-cover rounded-full"
          />
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-slate-800 dark:text-slate-500">
              {el?.name}
            </span>
            <span className="text-rose-800 font-medium">
              {formatNumber(el?.followers)}{" "}
              <span className="text-gray-600">Followers</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PopularWriters;
