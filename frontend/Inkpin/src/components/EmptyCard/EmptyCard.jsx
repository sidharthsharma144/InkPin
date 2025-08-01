import React from 'react';

const EmptyCard = ({ imgSrc,message, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-[70vh] text-center ${className}`}>
      <img src={null} className="w-60 max-w-full" />
      <p className="w-4/5 sm:w-1/2 text-sm font-medium text-slate-700 leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};
export default EmptyCard;
