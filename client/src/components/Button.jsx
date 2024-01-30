const Button = ({ label, styles, icon, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`flex items-center px-3 py-1.5 rounded justify-center text-base outline-none ${styles}`}
    >
      {label}
      {icon && <div className="ml-2">{icon}</div>}
    </button>
  );
};

export default Button;
