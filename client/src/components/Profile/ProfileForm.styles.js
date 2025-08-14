import { cilCursor } from '@coreui/icons';
import { colors } from '../../styles/colors';

export const profileFormStyles = (isDarkMode, sidebarVisible) => ({
  // Some styles from formContainerCard are not applied because of usage of Card element with className
  formContainerCard: {
    marginTop: '64px',
    transform: sidebarVisible ? 'translateX(127px)' : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: isDarkMode ? '#303746ff' : colors.primary,
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },

  title: {
    color: colors.primary,
    fontSize: '36px',
    fontWeight: 600,
    margin: 0,
  },

  editToggle: {
    color: isDarkMode ? colors.white : colors.primary,
    border: `1px solid ${colors.primary}`,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
  },

  inputGroupText: {
    backgroundColor: isDarkMode ? '#ffffff' : '#ffffff',
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
    backgroundColor: isDarkMode ? '#ffffff' : '#ffffff',
  },

  formInputDisabled: {
    backgroundColor: isDarkMode ? '#d4d4d4ff' : '#e7e7e7ff',
    cursor: 'not-allowed',
  },

  labelInInputGroupText: {
    marginBottom: '0px',
  },

  bottomActions: {
    position: 'absolute',
    bottom: '16px',
    left: '40px',
    right: '40px',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    paddingTop: '16px',
    backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
  },

  button: {
    border: `1px solid ${colors.primary}`,
    borderRadius: '12px',
    padding: '16px 24px',
    fontWeight: 600,
    fontSize: '18px',
    color: isDarkMode ? colors.white : colors.primary,
    transition: 'all 0.2s ease',
  },
});
