import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Notecard from '../../components/Cards/Notecard';
import { MdAdd } from "react-icons/md";
import AddEdit from './AddEdit';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';

export const Home = () => {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setopenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const triggerToast = (message, type = "add") => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className='container mx-auto px-10 '>
        <div className='grid grid-cols-3 gap-4 mt-8 justify-center'>
          {allNotes.map((item) => (
            <Notecard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
        </div>
      </div>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 absolute right-10 bottom-10'
        onClick={() => {
          setopenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEdit
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          getAllNotes={fetchAllNotes}
          showToastMessage={triggerToast}
          onClose={() => {
            setopenAddEditModal({ isShown: false, type: "add", data: null });
          }}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
