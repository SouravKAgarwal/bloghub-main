import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import UserProfile from "../assets/profile.png";
import { Logo, ThemeSwitch, Button } from "../components";
import useStore from "../store";

function getInitials(fullName) {
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialStr = initials.join("");

  return initialStr;
}

const MobileMenu = ({ user, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex">
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-fit bg-white dark:bg-[#020b19] z-50 flex flex-col py-10 items-center justify-center shadow-xl gap-8">
          <Logo />
          <ul className="flex flex-col gap-4 text-base dark:text-gray-300 text-black">
            <li onClick={toggleMenu}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/">About</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link to="/">Contact</Link>
            </li>
          </ul>

          <div className="flex gap-2 items-center">
            {user?.token ? (
              <div className="w-full flex items-center justify-center flex-col">
                <div className="flex gap-1 items-center mb-5">
                  {user?.user.image ? (
                    <img
                      src={user?.user.image ?? UserProfile}
                      className="w-8 h-8 rounded-full"
                      alt="profile"
                    />
                  ) : (
                    <span className="text-white w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      {getInitials(user?.user.name)}
                    </span>
                  )}
                  <span className="font-medium text-black dark:text-gray-300">
                    {user?.user?.name}
                  </span>
                </div>

                <button
                  className="bg-black dark:bg-rose-600 text-white dark:text-white px-8 py-1.5 rounded-full text-center outline-none"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  label="Sign In"
                  styles="flex items-center bg-black dark:bg-rose-600 text-white dark:text-white px-4 py-1.5 rounded-full justify-center"
                />
              </Link>
            )}
          </div>

          <span
            className="absolute top-10 right-10 cursor-pointer text-xl font-semibold dark:text-white"
            onClick={toggleMenu}
          >
            <AiOutlineClose />
          </span>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, signOut } = useStore();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    signOut();
  };

  return (
    <nav className="flex flex-row w-full py-5 items-center justify-between gap-4 md:gap-0">
      <Logo />

      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-8 text-base text-black dark:text-white font-semibold">
          <Link className="hover:text-slate-500" to="/">
            Home
          </Link>
          <Link className="hover:text-slate-500" to="/">
            About
          </Link>
          <Link className="hover:text-slate-500" to="/">
            Contact
          </Link>
        </ul>

        <ThemeSwitch />

        <div className="flex gap-2 items-center cursor-pointer">
          {user?.token ? (
            <div
              className="relative"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <div className="flex gap-1 items-center cursor-pointer">
                {user?.user.image ? (
                  <img
                    src={user?.user.image}
                    className="w-8 h-8 rounded-full"
                    alt="profile"
                  />
                ) : (
                  <span className="text-white w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {getInitials(user?.user.name)}
                  </span>
                )}

                <span className="font-medium text-black dark:text-gray-500">
                  {user?.user?.name?.split(" ")[0]}
                </span>
              </div>

              {showProfile && (
                <div className="absolute bg-white dark:bg-[#2f2d30] py-6 px-6 flex flex-col shadow-2xl z-50 right-0 gap-3 rounded">
                  <span className="dark:text-white">Profile</span>
                  <span
                    className="border-t border-slate-300 text-rose-700"
                    onClick={handleSignOut}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button
                label="Sign In"
                styles="flex items-center bg-black dark:bg-rose-600 text-white dark:text-white px-4 py-1.5 rounded-full justify-center"
              />
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center md:hidden">
        <ThemeSwitch />
        <MobileMenu user={user} signOut={handleSignOut} />
      </div>
    </nav>
  );
};

export default Navbar;