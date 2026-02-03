export const truncateText = (text, maxLength = 100) => {
    if (text && text.length <= maxLength) return text;
    return text ? text.substr(0, maxLength) + '...' : '';
};