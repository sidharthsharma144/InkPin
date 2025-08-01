import React from 'react';
import { MdDelete, MdOutlinePushPin, MdCreate } from "react-icons/md";
import moment from 'moment';

const Notecard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h6 className='text-sm font-medium'>{title}</h6>
          <span className='text-xs text-slate-500'>{moment(date).format("Do MMM YYYY")}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn cursor-pointer transition-colors ${
            isPinned ? 'text-blue-600' : 'text-slate-300'
          } hover:text-blue-600`}
          onClick={onPinNote}
        />
      </div>

      {/* Content */}
      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

      {/* Tags & Actions */}
      <div className='flex items-center justify-between mt-3'>
        <div className='text-xs text-slate-500'>{tags.map((item)=> `#${item}`)}</div>
        <div className='flex items-center gap-3'>
          <MdCreate
            className="icon-btn hover:text-green-600 cursor-pointer"
            onClick={onEdit}
          />
          <MdDelete
            className='icon-btn hover:text-red-500 cursor-pointer'
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Notecard;
