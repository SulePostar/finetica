import { colors } from '../../styles/colors';

export const badgeStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: 'white',
    padding: '6px 22px',
    fontSize: '0.85rem',
    borderRadius: '4px',
    marginRight: '1px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
});

export const buttonStyle = {
    backgroundColor: colors.registerGradient,
    color: '#fffff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 28px',
    fontSize: '0.85rem',
    marginRight: '1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
};
