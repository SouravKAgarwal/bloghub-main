import { Link } from "react-router-dom";
import { formatNumber } from "../utils";

const PopularWriters = ({ data }) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="text-xl font-bold -mb-3">
        Popular Writers
      </div>

      {data?.map((el) => (
        <Link
          to={`/writer/${el?._id}`}
          className="flex gap-2 items-center"
          key={el?._id}
        >
          <img
            src={el?.image}
            alt={el?.name}
            className="h-12 w-12 object-cover rounded-full"
          />
          <div className="flex flex-col gap-1">
            <span className="text-base">
              {el?.name}
            </span>
            <span className="text-rose-800">
              {formatNumber(el?.followers)}{" "}
              <span className="text-gray-500">Followers</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PopularWriters;
