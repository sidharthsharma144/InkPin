import React, { useState } from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import Searchbar from './Searchbar/Searchbar';


const Navbar = ({userInfo}) => {
  const [searchQuery, setSearchQuery ] = useState("")

  const navigate=useNavigate();

  const onLogout=()=>{
    localStorage.clear()
    navigate("/login");
  }
  const handleSearch = ()=>{}
  const onClearSearch=()=>{
    setSearchQuery("");
  }

  return (
    <div className='bg-white flex items-center justify-between px-20 drop-shadow'>
  <h2 className='text-xl font-medium text-black py-5'>Notes</h2>

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