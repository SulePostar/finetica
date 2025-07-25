export const colors = {
  // Primary Purple Theme
  primary: '#5b3cc4', // Main buttons, links, focus states
  primaryHover: '#553c9a', // Button hover state
  primaryLight: '#8367deff', // Login page left section background

  // Background Colors
  white: '#ffffff', // Card backgrounds, form sections
  lightGray: '#f7fafc', // Input backgrounds, input group icons

  // Gradient Backgrounds
  registerGradient: 'linear-gradient(to right, #dbd9e3ff, #a294ebff)',

  // Text Colors
  textPrimary: '#2d3748', // Main text, titles
  textSecondary: '#718096', // Subtitles, secondary text
  textPlaceholder: '#a0aec0', // Placeholder text

  // Border Colors
  borderLight: '#e2e8f0', // Input borders, separators
  borderMedium: '#d1d5db', // Input group separators

  // Alert Colors
  error: {
    background: '#fed7d7', // Error alert background
    text: '#9b2c2c', // Error alert text
  },
  success: {
    background: '#c6f6d5', // Success alert background
    text: '#276749', // Success alert text
  },

  // Focus and Interactive States
  focus: 'rgba(91, 60, 196, 0.25)', // Input focus box-shadow
  buttonHoverShadow: 'rgba(91, 60, 196, 0.3)', // Button hover shadow effect
};

// CSS Custom Properties for easy usage in stylesheets
export const cssVariables = `
  :root {
    --color-primary: ${colors.primary};
    --color-primary-hover: ${colors.primaryHover};
    --color-primary-light: ${colors.primaryLight};
    --color-white: ${colors.white};
    --color-light-gray: ${colors.lightGray};
    --color-text-primary: ${colors.textPrimary};
    --color-text-secondary: ${colors.textSecondary};
    --color-text-placeholder: ${colors.textPlaceholder};
    --color-border-light: ${colors.borderLight};
    --color-border-medium: ${colors.borderMedium};
    --color-error-bg: ${colors.error.background};
    --color-error-text: ${colors.error.text};
    --color-success-bg: ${colors.success.background};
    --color-success-text: ${colors.success.text};
    --color-focus: ${colors.focus};
    --color-button-hover-shadow: ${colors.buttonHoverShadow};
    --gradient-register: ${colors.registerGradient};
  }
`;

export default colors;
