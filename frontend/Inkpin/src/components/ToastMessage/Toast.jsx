import React, { useEffect } from 'react';
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div className={`absolute top-20 right-6 transition-all duration-400 ${isShown ? "opacity-100" : "opacity-0"}`}>
      <div className={`min-w-52 bg-white shadow-2xl rounded-md relative overflow-hidden`}>
        <div className={`absolute left-0 top-0 w-[5px] h-full ${type === "delete" ? "bg-red-500" : "bg-green-500"} rounded-l-lg`} />
        <div className="flex items-center gap-3 py-2 px-4">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type === "delete" ? "bg-red-50" : "bg-green-50"}`}>
            {type === 'delete'
              ? (<MdDeleteOutline className="text-xl text-red-500" />)
              : (<LuCheck className="text-xl text-green-500" />)}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
