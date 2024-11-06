import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../../services/auth.api";
const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const checkLogin = await login({
      email,
      password
    })
    console.log(checkLogin)

    if(checkLogin.ok){
      const token = checkLogin.token;
      localStorage.setItem('token', token);
      navigate('/list');

    }else{
      setErrors(checkLogin.errors)
    }
  };

  const handleRegisterRedirect = async () => {
    navigate('/register');

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        {successMessage && (
            <div className="bg-green-200 text-xs p-2">{successMessage}</div>
          )}
          {errors?.length > 0 && (
            <div className="p-2 bg-red-200">
              <ul>
                {errors.map((error, index) => (
                  <li className="text-xs" key={index}>
                    {error.msg}.
                  </li>
                ))}
              </ul>
            </div>
          )}

        <form onSubmit={handleLogin} className="mt-6">
          <div>
            <input
              id="email"
              type="email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mt-4">
            <input
              id="password"
              type="password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <button
            onClick={handleRegisterRedirect}
            className="text-gray-800 font-semibold hover:text-gray-700"
          >
            Register
          </button>
          </div>
      </div>
    </div>
  )


}
export default LoginPage;
