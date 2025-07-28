import React, { useState } from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa';
const Passwordinput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border border-gray-300 px-4 py-2 rounded-md mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="flex-1 text-base bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="text-sm text-gray-500 ml-3"
      >
        {isShowPassword ? "Hide" : "Show"}
      </button>
      
      <FaRegEye
      size={22}
      className='text-blue-600 cursor-pointer '
      onClick={()=> toggleShowPassword()}
      />
    </div>
  );
};

export default Passwordinput;
