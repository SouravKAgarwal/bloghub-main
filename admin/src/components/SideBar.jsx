import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconSettings,
  IconUser,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { BsPencilSquare } from "react-icons/bs";
import { ActionIcon, Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import useStore from "../store";

const mockdata = [
  { icon: IconGauge, label: "Dashboard", to: "dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics", to: "analytics" },
  { icon: IconCalendarStats, label: "Content", to: "contents" },
  { icon: IconUser, label: "Followers", to: "followers" },
  { icon: BsPencilSquare, label: "Create Post", to: "write" },
  { icon: IconSettings, label: "Settings" },
];

const NavLink = ({ icon: Icon, label, active, onClick }) => {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
          active
            ? "bg-black text-white dark:bg-gray-500 dark:text-slate-900"
            : ""
        }`}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        {label}
      </UnstyledButton>
    </Tooltip>
  );
};

const SideBar = ({ close = () => {} }) => {
  const { theme, setTheme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname?.slice(1);

  const handleClick = (to) => {
    close();
    navigate(to);
  };

  const handleTheme = (theme) => {
    localStorage.setItem("theme", theme);
  };

  const links = mockdata.map((link, index) => (
    <NavLink
      key={index}
      active={link.to === path}
      onClick={() => handleClick(link.to)}
      {...link}
    />
  ));

  return (
    <nav className="h-full flex flex-col gap-5 px-8 2xl:px-14">
      <p className="py-6 font-semibold flex justify-center">MENU</p>
      <Stack justify="center" gap={10}>
        {links}
      </Stack>

      <ActionIcon
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="default"
        size="xl"
        aria-label="Toggle mode"
        className="w-full rounded-full mt-10 dark:text-white text-black"
      >
        {theme === "dark" ? (
          <IconSun onClick={handleTheme("dark")} />
        ) : (
          <IconMoon onClick={handleTheme("light")} />
        )}
      </ActionIcon>
    </nav>
  );
};

export default SideBar;
