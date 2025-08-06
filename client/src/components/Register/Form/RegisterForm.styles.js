// RegisterForm styles - uses colors from '../../../styles/colors'

import { colors } from '../../../styles/colors';

// Inline styles object for RegisterForm component
export const registerFormStyles = {
  inputGroupText: {
    backgroundColor: colors.lightGray,
    border: `1px solid ${colors.borderLight}`,
    borderRight: `2px solid ${colors.borderMedium}`,
    color: colors.primary,
  },
  icon: {
    width: '16px',
    height: '16px',
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
    background: ${colors.registerGradient};
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
    background-color: ${colors.white};
    border: none;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    padding: 50px;
    transition: all 0.3s ease;
  }
  
  .register-form-header {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .register-form-title {
    color: ${colors.textPrimary};
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .register-form-subtitle {
    color: ${colors.textSecondary};
    opacity: 0.8;
    font-size: 18px;
  }
  
  .register-form .mb-3 {
    margin-bottom: 24px !important;
  }
  
  .register-form .mb-4 {
    margin-bottom: 32px !important;
  }
  
  .register-form input::placeholder {
    color: ${colors.textPlaceholder} !important;
    opacity: 1;
  }
  
  .register-form input:focus {
    box-shadow: 0 0 0 0.2rem ${colors.focus} !important;
    background-color: ${colors.lightGray} !important;
    border-color: ${colors.primary} !important;
  }
  
  .register-form .input-group-text {
    background-color: ${colors.lightGray} !important;
    border: 1px solid ${colors.borderLight} !important;
    border-right: 2px solid ${colors.borderMedium} !important;
    color: ${colors.primary} !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    padding: 16px !important;
    width: 60px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .register-form .form-control {
    background-color: ${colors.lightGray} !important;
    border: 1px solid ${colors.borderLight} !important;
    border-left: none !important;
    color: ${colors.textPrimary} !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding: 16px 20px !important;
    font-size: 16px !important;
    height: auto !important;
  }
  
  .register-form .input-group {
    border-radius: 12px !important;
    overflow: hidden !important;
  }
  
  .register-form-button {
    background-color: ${colors.primary} !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 16px 0 !important;
    font-weight: 600 !important;
    font-size: 18px !important;
    width: 100% !important;
    margin-top: 16px !important;
    transition: all 0.2s ease !important;
    color: ${colors.white} !important;
  }
  
  .register-form-button:hover:not(:disabled) {
    background-color: ${colors.primaryHover} !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 25px ${colors.buttonHoverShadow} !important;
  }
  
  .register-form-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
  }
  
  .register-form-login-link {
    text-align: center !important;
    margin-top: 24px !important;
    padding-top: 20px !important;
    border-top: 1px solid ${colors.borderLight} !important;
  }
  
  .register-form-login-link p {
    color: ${colors.textSecondary} !important;
    font-size: 16px !important;
    margin: 0 !important;
  }
  
  .register-form-link {
    color: ${colors.primary} !important;
    text-decoration: none !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
  }
  
  .register-form-link:hover {
    color: ${colors.primaryHover} !important;
    text-decoration: underline !important;
  }
  
  /* Alert Styles */
  .register-form .alert {
    border-radius: 12px !important;
    border: none !important;
  }
  
  .register-form .alert-danger {
    background-color: ${colors.error.background} !important;
    color: ${colors.error.text} !important;
  }
  
  .register-form .alert-success {
    background-color: ${colors.success.background} !important;
    color: ${colors.success.text} !important;
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
    
    .register-form-login-link {
      margin-top: 20px !important;
      padding-top: 16px !important;
    }
    
    .register-form-login-link p {
      font-size: 14px !important;
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
    
    .register-form-login-link {
      margin-top: 16px !important;
      padding-top: 14px !important;
    }
    
    .register-form-login-link p {
      font-size: 13px !important;
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
