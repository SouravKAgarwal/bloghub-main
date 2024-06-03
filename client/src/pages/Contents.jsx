import { Toaster, toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../store";
import { Comments, ConfirmDialog, Loading, Pagination } from "../components";
import { useEffect, useState } from "react";
import { formatNumber } from "../utils";
import {
  AiOutlineCodepen,
  AiOutlineEye,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { BiDotsVerticalRounded, BiPencil } from "react-icons/bi";
import moment from "moment";
import useCommentStore from "../store/commentStore";
import { useAction, useContent, useDeletePost } from "../hooks/postHooks";

const Contents = () => {
  const [searchParams] = useSearchParams();

  const { user } = useStore();
  const { setOpen, commentId, setCommentId } = useCommentStore();
  const [openedDropdown, setOpenedDropdown] = useState(null);

  const { deletePost } = useDeletePost(toast, user?.token);
  const { performAction } = useAction(toast, user?.token);

  const [opened, setOpened] = useState(false);
  const openConfirmDialog = () => setOpened(true);
  const closeConfirmDialog = () => setOpened(false);
  const [selected, setSelected] = useState("");
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const { data, fetchContent } = useContent(toast, user?.token);

  const navigate = useNavigate();

  const handleComment = (id, size) => {
    if (size > 0) {
      setCommentId(id);
      setOpen(true);
    }
  };

  const handlePerformAction = (val, id, status) => {
    setSelected(id);
    setType(val);
    setStatus(status);
    openConfirmDialog();
  };

  const handleAction = async () => {
    if (type === "delete") {
      await deletePost(selected);
    } else if (type === "status") {
      await performAction({ id: selected, status });
    }
    fetchContent(page);
    closeConfirmDialog();
  };

  const handlePageChange = (val) => {
    setPage(val);
  };

  const toggleDropdown = (id) => {
    setOpenedDropdown(openedDropdown === id ? null : id);
  };

  useEffect(() => {
    fetchContent(page);
  }, [page]);

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-x-hidden">
        <p className="text-lg pb-2 font-semibold dark:text-white text-black">
          Contents (
          <span>
            {data?.data?.length * data?.page +
              " of " +
              data?.totalPost +
              " records"}
          </span>
          )
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table">
            <thead className="table-header-group">
              <tr className="border border-gray-300 top-auto relative text-xs md:text-base">
                <th className="bg-gray-100 px-8 md:px-0 text-gray-600 font-bold table-cell"></th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Post Title
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Category
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Views
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Comments
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Post Date
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Status
                </th>
                <th className="bg-gray-100 p-2 border-l text-gray-600 font-bold table-cell">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="table-row-group">
              {data?.data?.length > 0 ? (
                data?.data.map((el) => (
                  <tr key={el?._id} className="table-row">
                    <td className="p-2 table-cell">
                      <img
                        src={el?.img}
                        alt={el?.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-2 border-l table-cell">
                      <p className="text-xs md:text-base">{el?.title}</p>
                    </td>
                    <td className="p-2 border-l table-cell">
                      <p className="text-xs md:text-base">{el?.cat}</p>
                    </td>
                    <td className="p-2 border-l table-cell">
                      <div className="flex gap-1 items-center text-xs md:text-base">
                        <AiOutlineEye size={18} />
                        {formatNumber(el?.views?.length)}
                      </div>
                    </td>
                    <td
                      className="p-2 border-l table-cell cursor-pointer"
                      onClick={() =>
                        handleComment(el?._id, el?.comments?.length)
                      }
                    >
                      <div className="flex gap-1 items-center text-xs md:text-base">
                        <MdMessage size={18} className="text-slate-500" />
                        {formatNumber(el?.comments?.length)}
                      </div>
                    </td>
                    <td className="p-2 border-l table-cell text-xs md:text-base">
                      {moment(el?.createdAt).fromNow()}
                    </td>
                    <td className="p-2 border-l table-cell">
                      <span
                        className={`${
                          el?.status
                            ? "bg-green-700 text-white"
                            : "bg-red-700 text-white"
                        } dark:opacity-50 opacity-70 rounded-full px-4 py-1.5 text-xs md:text-base`}
                      >
                        {el?.status === true ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-2 border-l table-cell relative">
                      <button onClick={() => toggleDropdown(el?._id)}>
                        <BiDotsVerticalRounded className="dark:text-white text-lg text-slate-900 " />
                      </button>
                      {openedDropdown === el?._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                          <button
                            className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:rounded-t-md dark:hover:bg-gray-600"
                            onClick={() => {
                              navigate(`/edit/${el?._id}`);
                              toggleDropdown(el?._id);
                            }}
                          >
                            <BiPencil />
                            Edit
                          </button>
                          <button
                            className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:rounded-t-md dark:hover:bg-gray-600"
                            onClick={() => {
                              handlePerformAction(
                                "status",
                                el?._id,
                                !el?.status
                              );
                              toggleDropdown(el?._id);
                            }}
                          >
                            <AiOutlineSetting />
                            {el?.status ? "Disable" : "Active"}
                          </button>
                          <div className="border-t border-gray-200 dark:border-gray-700"></div>
                          <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:hover:bg-red-100 hover:rounded-b-md"
                            onClick={() => {
                              handlePerformAction("delete", el?._id);
                              toggleDropdown(el?._id);
                            }}
                          >
                            <MdOutlineDeleteOutline />
                            Delete Post
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No Posts Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full flex items-center justify-center">
          <Pagination totalPages={data?.page} onPageChange={handlePageChange} />
        </div>
      </div>

      <ConfirmDialog
        opened={opened}
        close={closeConfirmDialog}
        handleClick={handleAction}
        message="Are you sure you want to perform this action?"
      />

      {commentId && <Comments />}
      <Toaster richColors />
    </>
  );
};

export default Contents;
