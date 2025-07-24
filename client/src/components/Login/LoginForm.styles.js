import { colors } from '../../styles/colors';

export const loginFormStyles = {
  // Login page layout styles using centralized colors
  leftSection: {
    flex: 1.8,
    backgroundColor: colors.primaryLight, // #8367deff
  },

  rightSection: {
    flex: 1.8,
    backgroundColor: colors.white, // #ffffff
  },

  // Form component styles
  card: {
    width: '100%',
    maxWidth: '600px',
  },

  forgotPasswordLink: {
    fontSize: '0.9rem',
    color: colors.primary, // #5b3cc4
  },

  loginButton: {
    backgroundColor: colors.primary, // #5b3cc4
  },

  signUpLink: {
    color: colors.primary, // #5b3cc4
    textDecoration: 'none',
    fontWeight: '600',
  },

  signUpText: {
    fontSize: '0.9rem',
  },
};

// CSS styles for login form with centralized colors
export const loginFormCSS = `
  .login-form input:focus {
    box-shadow: 0 0 0 0.2rem ${colors.focus} !important;
    border-color: ${colors.primary} !important;
  }
  
  .login-form .btn-primary {
    background-color: ${colors.primary} !important;
    border-color: ${colors.primary} !important;
  }
  
  .login-form .btn-primary:hover {
    background-color: ${colors.primaryHover} !important;
    border-color: ${colors.primaryHover} !important;
    box-shadow: 0 4px 15px ${colors.buttonHoverShadow} !important;
  }
  
  .login-form .text-medium-emphasis {
    color: ${colors.textSecondary} !important;
  }
  
  .login-form .alert-danger {
    background-color: ${colors.error.background} !important;
    color: ${colors.error.text} !important;
    border: none !important;
  }
`;

export const injectLoginFormStyles = () => {
  const style = document.createElement('style');
  style.id = 'login-form-styles';
  style.textContent = loginFormCSS;

  const existingStyle = document.getElementById('login-form-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);

  return () => {
    const styleToRemove = document.getElementById('login-form-styles');
    if (styleToRemove) {
      styleToRemove.remove();
    }
  };
};

export default loginFormStyles;
