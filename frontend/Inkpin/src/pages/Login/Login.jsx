import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Passwordinput from '../../components/Input/Passwordinput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState(null);
  const navigate=useNavigate();

  const handleLogin = async(e)=>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("please enter a valid email address");
      return;
    }
    if(!password){

    setError("invalid password");
    return;
    }
    setError("")
    //LOGIN API CALL
    try{
      const response = await axiosInstance.post("/login",{
        email:email,
        password:password,
      })
      // handle succesful login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    }
    catch(error){
  console.error("Login error:", error); // ✅ ADD THIS LINE

  if(error.response && error.response.data && error.response.data.message){
    setError(error.response.data.message);
  } else {
    setError("An Unexpected error occurred, Try again later");
  }
}

  }
  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28 '>
        <div className='w-97 border rounded bg-white px-7 py-10 '>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>

            {/* Fixed: Added value and onChange to input */}
            <input
              type="text"
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input-box '
            />
            {/* Fixed: Added value and onChange to Passwordinput */}
            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {error && <p className='text-red-500 text-xs pb-1 '>{error}</p>}

            <button type="submit" className='btn-primary'>
              Login
            </button>

            {/* Fixed: Removed extra quote */}
            <p className='text-sm text-center mt-4'>
              Not registered yet?{' '}
              <Link to="/signup" className="">Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
