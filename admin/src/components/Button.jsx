const Button = ({ label, styles, icon, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`flex items-center justify-center text-base outline-none px-4 py-1.5 text-white font-semibold rounded ${styles}`}
    >
      {label}
      {icon && <div className="ml-2">{icon}</div>}
    </button>
  );
};

export default Button;
