import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h1 style={s.title}>Welcome, {user.username}!</h1>
        <p style={s.description}>
          Thank you for visiting our application. We're glad to have you here.
        </p>
        <div style={s.buttonGroup}>
          <button style={s.button}>Get Started</button>
          <button style={s.buttonSecondary}>Learn More</button>
          <button style={s.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
        <p style={s.hint}>Ready to explore? Click above to begin.</p>
      </div>
    </div>
  );
};

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%,100%)',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    textAlign: 'center',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '12px',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '12px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  hint: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#888',
    textAlign: 'center',
  },
};

export default Welcome;