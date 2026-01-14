export const validateStrictDate = (year, month, day) => {
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return new Date('Invalid Date');
    }
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return new Date('Invalid Date');
    }

    return date;
};