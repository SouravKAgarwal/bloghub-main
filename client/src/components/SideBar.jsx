import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconUser,
} from "@tabler/icons-react";
import { BsPencilSquare } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

const mockdata = [
  { icon: IconGauge, label: "Dashboard", to: "dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics", to: "analytics" },
  { icon: IconCalendarStats, label: "Content", to: "contents" },
  { icon: IconUser, label: "Followers", to: "followers" },
  { icon: BsPencilSquare, label: "Create Post", to: "write" },
];

const NavLink = ({ icon: Icon, label, active, onClick }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition ${
          active
            ? "bg-black text-white dark:bg-gray-500 dark:text-slate-900"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        data-active={active || undefined}
      >
        <Icon className="w-5 h-5" stroke={1.5} />
        <span className="hidden md:inline">{label}</span>
      </button>
    </div>
  );
};

const SideBar = ({ close = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname?.slice(1);

  const handleClick = (to) => {
    close();
    navigate(to);
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
    <nav className="h-full flex flex-col gap-5">
      <p className="py-3 font-semibold flex justify-center">MENU</p>
      <div className="flex flex-col justify-center gap-4">{links}</div>
    </nav>
  );
};

export default SideBar;
