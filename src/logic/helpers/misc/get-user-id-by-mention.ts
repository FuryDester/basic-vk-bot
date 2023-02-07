export default (mention: string): number | null => {
  const id = mention.match(/^\[id(\d+)|.+]$/)[1];
  if (!id) {
    return null;
  }

  return Number.parseInt(id, 10);
};
