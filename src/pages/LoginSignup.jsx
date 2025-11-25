import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/loginSignup.css';
import API_BASE_URL from '../utils/api';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    name: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });

  // Helper function to redirect based on user type
  const redirectToDashboard = (userType) => {
    switch (userType) {
      case 'admin':
        navigate('/admin');
        break;
      case 'technician':
        navigate('/technician');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });

      const { data } = response;
      
      // Store user data in localStorage
      const userType = data.user?.userType || 'user';
      localStorage.setItem('userName', data.user?.name || loginData.name);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userData', 'true');
      localStorage.setItem('authToken', data.token);

      toast.success('Login successful! Welcome back.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        redirectToDashboard(userType);
      }, 2000);
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error status
        toast.error(err.response.data.message || 'Login failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (err.request) {
        // Request made but no response received
        toast.error('No response from server. Please check your connection.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Something else happened
        toast.error('Something went wrong during login. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;
    
    try {
      // Validate password confirmation
      if (registerData.password !== registerData.confirmPassword) {
        toast.error('Passwords do not match!', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: registerData.name,
        password: registerData.password,
        userType: 'user'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });

      const { data } = response;
      
      // Store user data in localStorage
      localStorage.setItem('userName', registerData.name);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('authToken', data.token);
      
      toast.success('Registration successful! Welcome to Circuit Hub.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        redirectToDashboard('user');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error status
        toast.error(err.response.data.message || 'Registration failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (err.request) {
        // Request made but no response received
        toast.error('No response from server. Please check your connection.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Something else happened
        toast.error('Something went wrong during registration. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Eye icon SVG components
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m1 1 22 22" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.71 6.71C4.06 8.29 2 12 2 12s4 8 11 8c1.54 0 2.95-.34 4.21-.91" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.46 10.46a3 3 0 0 0 4.08 4.08" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.18 17.18C15.41 18.38 13.78 19 12 19c-7 0-11-8-11-8a18.498 18.498 0 0 1 2.82-3.82" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className={`left-panel ${isLogin ? 'login-panel' : 'register-panel'}`}>
  
      </div>
      
      {/* Right Panel */}
      <div className="right-panel">
        {/* Header */}
        <div className="header">
          <h1 className="company-name">Circuit Hub System</h1>
        </div>
        
        {/* Form Container */}
        <div className="auth-form-container">
          <h2 className="welcome-title">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          <div className={`auth-form ${isLogin ? 'login-form' : 'register-form'}`}>
            {isLogin ? (
              // Login Form
              <>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={loginData.name}
                    onChange={handleLoginChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-input password-input"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="auth-button" 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
                
                <div className="auth-toggle">
                  <span className="toggle-text">Doesn't Have an Account?</span>
                  <span className="toggle-link" onClick={toggleAuthMode}>Sign up</span>
                </div>
              </>
            ) : (
              // Register Form
              <>
                <div className="form-group">
                  <label htmlFor="registerName" className="form-label">Name</label>
                  <input
                    type="text"
                    id="registerName"
                    name="name"
                    className="form-input"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="John Smith"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="registerPassword" className="form-label">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="registerPassword"
                      name="password"
                      className="form-input password-input"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="••••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input password-input"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="••••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="auth-button" 
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
                
                <div className="auth-toggle">
                  <span className="toggle-text">Already have an account?</span>
                  <span className="toggle-link" onClick={toggleAuthMode}>Sign in</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignup;