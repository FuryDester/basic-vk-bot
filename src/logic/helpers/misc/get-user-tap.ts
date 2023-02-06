export default (userId: number, text: string): string => {
  return `@id${userId} (${text})`;
};
