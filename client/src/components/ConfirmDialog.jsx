import React from "react";

const ConfirmDialog = ({ message, opened, handleClick, close }) => {
  if (!opened) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black dark:text-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
        <p className="text-base">{message}</p>
        <div className="w-full flex gap-6 justify-end mt-8">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleClick}
          >
            OK
          </button>
          <button
            className="border border-slate-300 text-slate-600 px-4 py-2 rounded"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
