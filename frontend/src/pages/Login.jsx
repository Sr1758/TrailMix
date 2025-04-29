import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Login.css';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleLogin();
      setEmail('');
      setPassword('');
      setError('');
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-background">
      <h1 className="login-title">Welcome to TrailMixer</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/signup" className="signup-link-text">Sign Up</a>
      </p>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default Login;