export const titleCase = (text: string) => {
    const words = text.trim().split(/\s/);
    const lowerCaseWords = words.map((word) => word.toLowerCase());
    const titleCaseWords = lowerCaseWords.map((word) => word[0].toUpperCase() + word.substring(1));
    return titleCaseWords.join(' ');
};
