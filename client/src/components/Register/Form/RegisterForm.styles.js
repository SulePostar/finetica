export const registerFormStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a202c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#2d3748',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#a0aec0',
    opacity: 0.75,
  },
  inputGroupText: {
    backgroundColor: '#4a5568',
    border: 'none',
    color: '#a0aec0',
    borderRight: '1px solid #cbd5e0',
  },
  icon: {
    width: '16px',
    height: '16px',
  },
  button: {
    backgroundColor: '#48bb78',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 0',
    fontWeight: '500',
    fontSize: '16px',
  },
};

export const registerFormCSS = `
  body {
    margin: 0;
    padding: 0;
  }
  
  .register-form-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #1a202c;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    z-index: 1000;
  }
  
  .register-form-card {
    width: 100%;
    max-width: 600px;
    background-color: #2d3748;
    border: none;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 50px;
    transition: all 0.3s ease;
  }
  
  .register-form-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .register-form-title {
    color: #fff;
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .register-form-subtitle {
    color: #a0aec0;
    opacity: 0.75;
    font-size: 18px;
  }
  
  .register-form .mb-3 {
    margin-bottom: 24px !important;
  }
  
  .register-form .mb-4 {
    margin-bottom: 32px !important;
  }
  
  .register-form input::placeholder {
    color: #a0aec0 !important;
    opacity: 1;
  }
  
  .register-form input:focus {
    box-shadow: 0 0 0 0.2rem rgba(72, 187, 120, 0.25) !important;
    background-color: #4a5568 !important;
    border-color: #48bb78 !important;
  }
  
  .register-form .input-group-text {
    background-color: #4a5568 !important;
    border: none !important;
    border-right: 2px solid #cbd5e0 !important;
    color: #a0aec0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    padding: 16px !important;
    width: 60px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .register-form .form-control {
    background-color: #4a5568 !important;
    border: none !important;
    color: #fff !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding: 16px 20px !important;
    font-size: 16px !important;
    height: auto !important;
  }
  
  .register-form-button {
    background-color: #48bb78 !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 16px 0 !important;
    font-weight: 600 !important;
    font-size: 18px !important;
    width: 100% !important;
    margin-top: 16px !important;
    transition: all 0.2s ease !important;
  }
  
  .register-form-button:hover:not(:disabled) {
    background-color: #38a169 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3) !important;
  }
  
  .register-form-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .register-form-container {
      padding: 16px;
    }
    
    .register-form-card {
      max-width: 100%;
      padding: 32px 24px;
      border-radius: 12px;
    }
    
    .register-form-title {
      font-size: 28px;
    }
    
    .register-form-subtitle {
      font-size: 16px;
    }
    
    .register-form .input-group-text {
      padding: 14px !important;
      width: 50px !important;
    }
    
    .register-form .form-control {
      padding: 14px 16px !important;
      font-size: 16px !important;
    }
    
    .register-form-button {
      padding: 14px 0 !important;
      font-size: 16px !important;
    }
  }
  
  @media (max-width: 480px) {
    .register-form-container {
      padding: 12px;
    }
    
    .register-form-card {
      padding: 24px 20px;
      border-radius: 8px;
    }
    
    .register-form-title {
      font-size: 24px;
    }
    
    .register-form-subtitle {
      font-size: 14px;
    }
    
    .register-form .mb-3 {
      margin-bottom: 20px !important;
    }
    
    .register-form .mb-4 {
      margin-bottom: 24px !important;
    }
    
    .register-form .input-group-text {
      padding: 12px !important;
      width: 45px !important;
    }
    
    .register-form .form-control {
      padding: 12px 14px !important;
      font-size: 14px !important;
    }
    
    .register-form-button {
      padding: 12px 0 !important;
      font-size: 14px !important;
    }
  }
  
  @media (min-width: 1200px) {
    .register-form-card {
      max-width: 650px;
      padding: 60px;
    }
    
    .register-form-title {
      font-size: 42px;
    }
    
    .register-form-subtitle {
      font-size: 20px;
    }
  }
`;

export const injectRegisterFormStyles = () => {
  const style = document.createElement('style');
  style.id = 'register-form-styles';
  style.textContent = registerFormCSS;

  const existingStyle = document.getElementById('register-form-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);

  return () => {
    const styleToRemove = document.getElementById('register-form-styles');
    if (styleToRemove) {
      styleToRemove.remove();
    }
  };
};
