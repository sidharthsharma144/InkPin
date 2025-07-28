import React, { useState } from 'react'
import Navbar from '../../components/Navbar';
import Notecard from '../../components/Cards/Notecard';
import {MdAdd} from "react-icons/md"
import AddEdit from './AddEdit';
import Modal from "react-modal"

export const Home = () => {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShown: false,
    type:"add",
    data:null,
  });

  return (
    <>
    <Navbar />

    <div className='container mx-auto px-10 '>
      <div className='grid grid-cols-3 gap-4 mt-8 justify-center'>
      <Notecard title="Meeting on 7th April" 
      date="3rd apr 2024"
      content="Meeting on 7th April"
      tags="#Meeting"
      isPinned={true}
      onEdit={()=>{}}
      onDelete={()=>{}}
      onPinNote={()=>{}}
      />
      </div>
    </div>
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 absolute right-10 bottom-10  ' onClick={()=>{
      setopenAddEditModal({isShown:true,type:"add",data:null})
    }}>
      <MdAdd className='text-[32px] text-white ' />

    </button>
    <Modal
    isOpen={openAddEditModal.isShown}
    onRequestClose={()=>{}}
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
      },
    }}
    contentLabel=""
    className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll ">
     <AddEdit type={openAddEditModal.type} noteData={openAddEditModal.data} onClose={()=>{
      setopenAddEditModal({isShown:false, type:"add",data:null})
     }}/>
    </Modal>
    </>
  )
}
export default Home;