export function toUppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function absoluteValue(string: string): number {
    
    const numericString = string.replace(/[^\d.,-]/g, '');
    const numericValue = Math.abs(parseFloat(numericString));
    return numericValue;
}