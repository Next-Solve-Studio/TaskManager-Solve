export const FormatPhone = (value) => {
    if (!value) return "";

    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
        return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;

    const prefixEnd = numbers.length === 10 ? 6 : 7;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, prefixEnd)}-${numbers.slice(prefixEnd)}`;
};
