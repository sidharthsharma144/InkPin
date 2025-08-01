import React, { useState } from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import Searchbar from './Searchbar/Searchbar';

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery ] = useState("")

  const navigate=useNavigate();

  const onLogout=()=>{
    localStorage.clear()
    navigate("/login");
  }
  const handleSearch = ()=>{
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  }
  const onClearSearch=()=>{
    setSearchQuery("");
    handleClearSearch()
  }

  return (
    <div className='bg-white flex items-center justify-between px-20 drop-shadow cursor-pointer'>
  <h2 className='text-xl font-medium text-black py-5 '>Notes</h2>

  <Searchbar
    value={searchQuery}
    onChange={({ target }) => {
      setSearchQuery(target.value);
    }}
    handleSearch={handleSearch}
    onClearSearch={onClearSearch}
  />

  {/* Add small margin to bring ProfileInfo 4px closer to Searchbar */}
  <div>
    <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
  </div>
</div>

  )
}

export default Navbar;