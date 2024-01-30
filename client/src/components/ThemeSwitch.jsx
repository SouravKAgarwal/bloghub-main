import { useState } from "react";
import useStore from "../store";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = (checked) => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(checked);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <DarkModeSwitch checked={isDarkMode} onChange={toggleTheme} size={24} />
    </div>
  );
};

export default ThemeSwitch;
