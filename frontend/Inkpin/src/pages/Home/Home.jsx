import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Notecard from '../../components/Cards/Notecard';
import { MdAdd } from "react-icons/md";
import AddEdit from './AddEdit';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from "../../assets/images/add-notes.jpg";
import NoDataImg from "../../assets/images/nodata.png";

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

  const [isSearch, setIsSearch]=useState(false)

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

  const deleteNote = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        triggerToast("Note Deleted Successfully", "delete");
        setAllNotes((prevNotes) => prevNotes.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };
  
  //SEARCH NOTES
  const onSearchNote = async(query)=>{
    try{
      const response = await axiosInstance.get("/search-notes",
        {
          params:{query},

        }
      )
      if(response.data&& response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }

    }
    catch(error){
      console.log(error);

    }
  }
  const updateIsPinned = async (noteData) => {
  const noteId = noteData._id;
  try {
    const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
      isPinned: !noteData.isPinned, // ✅ correct toggle
    });
    if (response.data && response.data.note) {
      triggerToast("Note Updated Successfully");
      fetchAllNotes(); // ✅ correct function
    }
  } catch (error) {
    console.log(error);
  }
};


  const handleClearSearch=()=>{
    setIsSearch(false);
    fetchAllNotes();
  }
  useEffect(() => {
    fetchAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-64 "
        style={{ backgroundImage: `url(${AddNotesImg})` }}
      ></div>

      {/* Content Over Background */}
      <div className="relative z-10">
        <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

        <div className='container mx-auto px-10'>
          {allNotes.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
              {allNotes.map((item) => (
                <Notecard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => {updateIsPinned(item)}}
                />
              ))}
            </div>
          ) : (
            !openAddEditModal.isShown && (
              <div className="flex justify-center mt-10">
                <EmptyCard
                imgSrc={isSearch?NoDataImg:AddNotesImg}
                  message={isSearch? `Oops! No notes found matching your search`: `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!`}
                />
              </div>
            )
          )}
        </div>

        {/* Add Note Button */}
        <button
          className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 fixed right-10 bottom-10 z-20'
          onClick={() => {
            setopenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className='text-[32px] text-white' />
        </button>

        {/* Modal for Add/Edit */}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {
            setopenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          ariaHideApp={false}
          style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 50, 
           } }}
          contentLabel=""
          className="w-[90%] sm:w-[60%] lg:w-[40%] max-h-[80vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
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

        {/* Toast Message */}
        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </>
  );
};

export default Home;
