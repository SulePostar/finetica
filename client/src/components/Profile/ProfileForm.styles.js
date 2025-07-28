import { colors } from '../../styles/colors';

export const profileFormStyles = (isDarkMode) => {
  return {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: colors.registerGradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      zIndex: 1000,
    },

    card: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: colors.white,
      border: 'none',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      padding: '50px',
      transition: 'all 0.3s ease',
    },

    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },

    title: {
      color: isDarkMode ? '#FFFFFF' : colors.textPrimary,
      fontSize: '36px',
      fontWeight: 600,
      marginBottom: '12px',
      textAlign: 'center',
    },

    subtitle: {
      color: colors.textSecondary,
      opacity: 0.8,
      fontSize: '18px',
    },

    formControl: {
      backgroundColor: colors.lightGray,
      border: `1px solid ${colors.borderLight}`,
      color: colors.textPrimary,
      padding: '16px 20px',
      fontSize: '16px',
      height: 'auto',
      borderRadius: '12px',
    },

    inputGroup: {
      display: 'flex',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '24px',
    },

    inputGroupText: {
      backgroundColor: colors.lightGray,
      border: `1px solid ${colors.borderLight}`,
      borderRight: `2px solid ${colors.borderMedium}`,
      color: colors.primary,
      padding: '16px',
      width: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    labelInInputGroupText: {
      marginBottom: '0px',
    },

    icon: {
      width: '16px',
      height: '16px',
    },

    placeholder: {
      color: colors.textPlaceholder,
    },

    focus: {
      boxShadow: `0 0 0 0.2rem ${colors.focus}`,
      backgroundColor: colors.lightGray,
      borderColor: colors.primary,
    },

    button: {
      backgroundColor: colors.primary,
      borderRadius: '12px',
      padding: '16px 0',
      fontWeight: 600,
      fontSize: '18px',
      width: '100%',
      color: colors.white,
      border: 'none',
      transition: 'all 0.2s ease',
      marginTop: '16px',
    },

    buttonHover: {
      backgroundColor: colors.primaryHover,
      boxShadow: `0 8px 25px ${colors.buttonHoverShadow}`,
      transform: 'translateY(-1px)',
    },

    disabledButton: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },

    alert: {
      borderRadius: '12px',
      border: 'none',
      padding: '16px',
    },

    alertError: {
      backgroundColor: colors.error.background,
      color: colors.error.text,
    },

    alertSuccess: {
      backgroundColor: colors.success.background,
      color: colors.success.text,
    },

    formContainerCard: {
      width: '100%',
      maxWidth: '600px',
      margin: 'auto',
      padding: '40px',
      backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },

    centeringContainerStyle: {
      width: '100%',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};
