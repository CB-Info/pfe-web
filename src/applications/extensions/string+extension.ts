export function toCapitalize(str: string): string {
    // Replace underscores with spaces and capitalize each word
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}