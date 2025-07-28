import React, { useState } from 'react'
import {MdAdd,MdClose} from "react-icons/md"


const TagInput = ({tags, setTags}) => {
    const [inputValue,setInputValue]=useState("");

    const handleInputChange=(e)=>{
        setInputValue(e.target.value);
    };

    const addnewtag=()=>{
        if(inputValue.trim()!==""){
            setTags([...tags,inputValue.trim()])
            setInputValue("");
        }
    }
    const handleKeyDown=(e)=>{
        if(e.key==="Enter"){
            addnewtag();
        }
    }
    const handleRemoveTag = (tagToremove)=>{
        setTags(tags.filter((tag)=>tag!==tagToremove))
    }

  return (
    
    <div>
        {tags?.length>0 &&(
            <div className='flex items-center gap-2 flex-wrap mt-2'>
       
        {tags.map((tag,index)=>(
            <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded'>
                 #{tag}
                 <button onClick={()=>{
                    handleRemoveTag(tag)
                 }}>
                    <MdClose/>
                </button>
            </span>
        )

        )}
        </div>
         )}


    <div className=''>
        <div className='flex items-center gap-4 mt-3 '>
            <input type="text" value={inputValue} className='text-sm bg-transparent border px-3 py-2 rounded outline-none' placeholder='Add Tags' 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            
            />

            <button className='w-8 h-8 flex items-center justify-center rounded border border-blue-600 hover:bg-blue-700 ' onClick={()=>{addnewtag()}}>
                <MdAdd className="text-2xl text-blue-600 hover:text-white" />
            </button>
        </div>
    </div>
    </div>
  
  )
}

export default TagInput