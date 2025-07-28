import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import Passwordinput from '../../components/Input/Passwordinput';
import { validateEmail } from '../../utils/helper';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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

    // Reset error
    setError('');

    // TODO: Submit signup data to backend or Firebase here
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

            <button type="submit" className="btn-primary">
              Sign Up
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
