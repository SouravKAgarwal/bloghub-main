import { Toaster, toast } from "sonner";
import { Button, Menu, Pagination, Table } from "@mantine/core";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../store";
import useCommentStore from "../store/commentStore";
import { Comments, ConfirmDialog, Loading } from "../components";
import { useDisclosure } from "@mantine/hooks";
import { useAction, useContent, useDeletePost } from "../hooks/postHooks";
import { useEffect, useState } from "react";
import { formatNumber, updateUrl } from "../utils";
import { AiOutlineEye, AiOutlineSetting } from "react-icons/ai";
import { MdMessage, MdOutlineDeleteOutline } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import moment from "moment";

const Content = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useStore();
  const { setOpen, commentId, setCommentId } = useCommentStore();
  const [visible, { toggle }] = useDisclosure(false);
  const { data, isPending, mutate } = useContent(toast, toggle, user?.token);
  const useDelete = useDeletePost(toast, user?.token);
  const useActions = useAction(toast, user?.token);

  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState("");
  const [type, setType] = useState(null);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const fetchContent = async () => {
    updateUrl({ page, navigate, location });
    mutate(page);
  };

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
    open();
  };

  const handleAction = () => {
    switch (type) {
      case "delete":
        useDelete.mutate(selected);
        break;
      case "status":
        useActions.mutate({ id: selected, status });
        break;
    }

    fetchContent();
    close();
  };

  useEffect(() => {
    fetchContent();
  }, [page]);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <p className="text-lg pb-2 font-semibold dark:text-white text-black">
          Contents ({" "}
          <span>
            {data?.data?.length * data?.page +
              " of " +
              data?.totalPost +
              " records"}
          </span>
          )
        </p>

        <Table highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Post Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Views</Table.Th>
              <Table.Th>Comments</Table.Th>
              <Table.Th>Post Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.data?.length > 0 &&
              data?.data.map((el) => (
                <Table.Tr
                  key={el?._id}
                  className="text-slate-600 dark:text-gray-400"
                >
                  <Table.Td className="flex gap-2 items-center">
                    <img
                      src={el?.img}
                      alt={el?.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-base">{el?.title}</p>
                    </div>
                  </Table.Td>

                  <Table.Td>{el?.cat}</Table.Td>

                  <Table.Td>
                    <div className="flex gap-1 items-center">
                      <AiOutlineEye size={18} />
                      {formatNumber(el?.views?.length)}
                    </div>
                  </Table.Td>

                  <Table.Td
                    onClick={() => handleComment(el?._id, el?.comments?.length)}
                  >
                    <div className="flex gap-1 items-center cursor-pointer">
                      <MdMessage size={18} className="text-slate-500" />
                      {formatNumber(el?.comments?.length)}
                    </div>
                  </Table.Td>

                  <Table.Td>{moment(el?.createdAt).fromNow()}</Table.Td>

                  <Table.Td>
                    <span
                      className={`${
                        el?.status
                          ? "bg-green-700 text-white"
                          : "bg-red-700 text-white"
                      } dark:opacity-50 opacity-70 rounded-full font-semibold px-4 py-1.5`}
                    >
                      {el?.status === true ? "Active" : "Disabled"}
                    </span>
                  </Table.Td>

                  <Table.Td width={5}>
                    <Menu
                      transitionProps={{
                        transition: "rotate-right",
                        duration: 150,
                      }}
                      shadow="lg"
                      width={200}
                    >
                      <Menu.Target>
                        <Button>
                          <BiDotsVerticalRounded className="dark:text-white text-lg text-slate-900 " />
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<AiOutlineSetting />}
                          onClick={() =>
                            handlePerformAction("status", el?._id, !el?.status)
                          }
                        >
                          {el?.status ? "Disable" : "Active"}
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Label>Danger Zone</Menu.Label>
                        <Menu.Item
                          color="red"
                          leftSection={<MdOutlineDeleteOutline />}
                          onClick={() => handlePerformAction("delete", el?._id)}
                        >
                          Delete Post
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>

          {data?.data?.length < 1 && (
            <Table.Caption>No Posts Found.</Table.Caption>
          )}
        </Table>

        <div className="w-full mt-5 flex items-center justify-center bg-transparent">
          <Pagination
            classNames={{ control: "text-black dark:text-white" }}
            defaultValue={data?.page}
            total={data?.numOfPage}
            siblings={1}
            withEdges
            onChange={(value) => setPage(value)}
          />
        </div>

        <Loading visible={isPending} />
        <Toaster richColors />
      </div>

      <ConfirmDialog
        opened={opened}
        close={close}
        handleClick={handleAction}
        message="Are you sure you want to perform this action?"
      />

      {commentId && <Comments />}
    </>
  );
};

export default Content;
