export default (time: string): number | null => {
  let seconds = 0;
  time.match(/(\d+)([wdhms])/g).forEach((match) => {
    const dateSymbol = match.slice(-1);
    const dateValue = parseInt(match.slice(0, -1), 10);
    switch (dateSymbol) {
      case 'w':
        seconds += dateValue * 604800;
        break;
      case 'd':
        seconds += dateValue * 86400;
        break;
      case 'h':
        seconds += dateValue * 3600;
        break;
      case 'm':
        seconds += dateValue * 60;
        break;
      case 's':
        seconds += dateValue;
        break;
      default:
        return null;
    }
  });

  return seconds || null;
};
