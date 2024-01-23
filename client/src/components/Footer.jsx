import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row w-full py-8 items-center justify-between text-[14px] text-gray-700 dark:text-gray-500">
      <p>&copy; 2023 SouravKrAgarwal - All Rights Reserved.</p>
      <div className="flex gap-5">
        <Link to="/contact">Contact</Link>
        <Link to="/">Terms Of Service</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default Footer;
