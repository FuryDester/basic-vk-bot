export default (array: any[]): any[] => {
  return array.filter((item, index, self) => self.indexOf(item) === index);
};
