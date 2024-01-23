import useStore from "../store";
import { Link, useLocation } from "react-router-dom";
import { Logo, SideBar } from "../components";
import { MdArrowForward } from "react-icons/md";
import { BiMenu } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { Menu, Button, rem, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";

const MobileDrawer = () => {
  const { user } = useStore();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <SideBar close={close} />

        <div className="w-full mt-10">
          <UserMenu user={user?.user} />
        </div>
      </Drawer>

      <Button>
        <BiMenu className="text-xl text-black dark:text-white" onClick={open} />
      </Button>
    </>
  );
};

const UserMenu = ({ user }) => {
  const { signOut } = useStore();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    signOut();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          className="flex items-center"
          style={{ background: "transparent" }}
        >
          <img
            src={user?.image}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />

          <div className="flex flex-col items-start ml-3 dark:text-gray-200 text-black">
            <p className="font-medium">{user?.name}</p>
            <span className="text-sm font-normal">{user?.accountType}</span>
          </div>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          left={<FaUser style={{ width: rem(14), height: rem(14) }} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={
            <AiOutlineLogout
              style={{ width: rem(14), height: rem(14) }}
              onClick={() => handleSignOut()}
            />
          }
        >
          Logout
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger Zone</Menu.Label>
        <Menu.Item
          color="red"
          onClick={() => {}}
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Delete Account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const NavBar = () => {
  const { user, signInModal, setSignInModal } = useStore();
  const location = useLocation();

  const handleLogin = () => {
    if (location.pathname === "/auth") {
      setSignInModal(!signInModal);
    }
  };

  return (
    <div className="fixed w-full top-0 z-50 bg-transparent flex flex-row px-4 md:px-6 py-4 items-center justify-between gap-4 border-b">
      {user && (
        <div className="block lg:hidden">
          <MobileDrawer />
        </div>
      )}

      <Logo />

      <div className="flex gap-14 items-center">
        <div className="flex gap-2 items-center">
          {user?.token ? (
            <UserMenu user={user?.user} />
          ) : (
            <Link
              to="/auth"
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-full 2xl:mr-10 text-base dark:text-white"
            >
              Login <MdArrowForward />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
