import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/loginSignup.css';
import API_BASE_URL from '../utils/api'

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    name: 'John Smith',
    password: '••••••••••'
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
        // For regular users, redirect to main dashboard
        navigate('/dashboard');
        break;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
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
        
        console.log(data);
      } else {
        toast.error(data.message || 'Login failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong during login. Please check your connection.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRegister = async () => {
    try {
      // Validate password confirmation
      if (registerData.password !== registerData.confirmPassword) {
        toast.error('Passwords do not match!', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          password: registerData.password,
          userType: 'user'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userName', registerData.name);
        localStorage.setItem('userType', 'user');
        localStorage.setItem('authToken', data.token);
        
        toast.success('Registration successful! Welcome to Electronics Inventory.', {
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
        
        console.log(data);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Something went wrong during registration. Please check your connection.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    // Reset password visibility when switching forms
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
          <h1 className="company-name">Electronics Inventory System</h1>
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
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <button type="button" className="auth-button" onClick={handleLogin}>
                  Sign in
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
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                
                <button type="button" className="auth-button" onClick={handleRegister}>
                  Sign Up
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