import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      padding: '40px 0 20px 0',
      textAlign: 'center',
      fontFamily: 'inherit',
      marginTop: '40px',
      boxShadow: '0 -2px 16px rgba(102,126,234,0.08)',
      position: 'relative',
      zIndex: 2
    }}>
      <div style={{ marginBottom: '18px', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <span role="img" aria-label="logo" className="footer-briefcase-logo" style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>�</span> BudgetBoss &copy; {new Date().getFullYear()}
      </div>
      <div style={{ marginBottom: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <span role="img" aria-label="rocket">🚀</span> Powered by <span style={{ fontWeight: 'bold', color: '#ffe066' }}>Tarun Varshney</span>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' }}>
        <a href="mailto:tarun@example.com" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}><span role="img" aria-label="email">✉️</span> Email</a>
        <a href="https://github.com/tarunvarshney" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}><span role="img" aria-label="github">🐙</span> GitHub</a>
        <a href="https://linkedin.com/in/tarunvarshney" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}><span role="img" aria-label="linkedin">💼</span> LinkedIn</a>
        <a href="https://twitter.com/tarunvarshney" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}><span role="img" aria-label="twitter">🐦</span> Twitter</a>
      </div>
      <div style={{ fontSize: '1rem', opacity: 0.85, marginBottom: '10px' }}>
        Made by <span style={{ fontWeight: 'bold', color: '#ffe066' }}>Tarun Varshney</span> with <span style={{ color: '#ff4d4f' }}>❤</span> for productivity &amp; financial freedom.
      </div>
      <div style={{ marginTop: '18px', fontSize: '0.95rem', opacity: 0.7 }}>
        <span role="img" aria-label="star">⭐</span> Thank you for using BudgetBoss!
      </div>
    </footer>
  );
};

export default Footer;