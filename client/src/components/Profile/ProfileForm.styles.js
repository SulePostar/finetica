// src/components/ProfileForm/ProfileForm.styles.js
import { colors } from '../../styles/colors';

export const profileFormStyles = (isDarkMode) => ({
  formContainerCard: {
    position: 'relative', // ← allow absolute children
    width: '100%',
    maxWidth: '600px',
    margin: '-30px',
    padding: '20px',
    backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },

  /* header wrapper (you can add bg or padding here if you like) */
  header: {
    // currently just flex container via className
  },

  title: {
    color: isDarkMode ? '#FFFFFF' : colors.textPrimary,
    fontSize: '36px',
    fontWeight: 600,
    margin: 0, // remove mb-4 since header has spacing
  },

  editToggle: {
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
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

  /* Bottom action bar: absolutely pinned inside the card */
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
    backgroundColor: colors.primary,
    borderRadius: '12px',
    padding: '16px 24px',
    fontWeight: 600,
    fontSize: '18px',
    color: colors.white,
    border: 'none',
    transition: 'all 0.2s ease',
  },
});
