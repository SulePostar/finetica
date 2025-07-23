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
    max-width: 400px;
    background-color: #2d3748;
    border: none;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 40px;
  }
  
  .register-form-header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .register-form-title {
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .register-form-subtitle {
    color: #a0aec0;
    opacity: 0.75;
    font-size: 16px;
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
  }
  
  .register-form .form-control {
    background-color: #4a5568 !important;
    border: none !important;
    color: #fff !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  
  .register-form-button {
    background-color: #48bb78 !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 12px 0 !important;
    font-weight: 500 !important;
    font-size: 16px !important;
    width: 100% !important;
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
