export const titleCase = (text: string): string => {
    const lowerCaseWords = splitToLowerCaseWords(text);
    const titleCaseWords = lowerCaseWords.map((word) => word[0].toUpperCase() + word.substring(1));
    return titleCaseWords.join('');
};

const splitToLowerCaseWords = (text: string): string[] => {
    const words = text.trim().split(/[\s\-]/);
    return words.map((word) => word.toLowerCase());
};
