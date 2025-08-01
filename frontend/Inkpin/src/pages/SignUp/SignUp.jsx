import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Passwordinput from '../../components/Input/Passwordinput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance'; // ✅ Make sure this path is correct

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Optional UX
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Please enter your name');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    setError('');
    setLoading(true); // Set loading while waiting for API

    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email,
        password,
      });

      if (response.data?.error) {
        setError(response.data.message);
        return;
      }

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      } else {
        setError("Signup successful but token missing. Please login.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-97 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Signup</h4>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-box"
            />

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
            />

            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
