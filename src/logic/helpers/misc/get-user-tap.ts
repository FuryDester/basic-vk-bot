export default (userId: number, text: string): string => {
  return `[${userId}|${text}]`;
};
