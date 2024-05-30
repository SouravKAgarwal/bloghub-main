const InputBox = ({
  label,
  name,
  type = "text",
  isRequired = false,
  placeholder,
  value,
  onChange,
  className,
  multiline = false,
  options = [],
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={name} className="text-slate-900 dark:text-white">
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          required={isRequired}
          className={`dark:bg-transparent appearance-none block w-full px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base resize-none ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows="4"
        ></textarea>
      ) : options.length > 0 ? (
        <select
          name={name}
          required={isRequired}
          className={`dark:bg-transparent appearance-none block w-full px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base ${className}`}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          required={isRequired}
          className={`dark:bg-transparent appearance-none block w-full px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default InputBox;
