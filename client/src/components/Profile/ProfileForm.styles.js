import { colors } from '../../styles/colors';

export const profileFormStyles = (isDarkMode) => {
  return {
    formContainerCard: {
      width: '100%',
      maxWidth: '600px',
      margin: 'auto',
      padding: '40px',
      backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },

    title: {
      color: isDarkMode ? '#FFFFFF' : colors.textPrimary,
      fontSize: '36px',
      fontWeight: 600,
      marginBottom: '12px',
      textAlign: 'center',
    },

    inputGroupText: {
      backgroundColor: isDarkMode ? '#b7b8bbff' : '#ecececff',
      border: `1px solid ${colors.borderLight}`,
      borderRight: `2px solid ${colors.borderMedium}`,
      color: colors.primary,
      padding: '16px',
      width: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    formInput: {
      backgroundColor: isDarkMode ? '#e0e0e0' : colors.lightGray,
    },

    formInputDisabled: {
      backgroundColor: isDarkMode ? '#b7b8bbff' : '#ecececff',
    },

    labelInInputGroupText: {
      marginBottom: '0px',
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
  };
};
