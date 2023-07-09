export const constLanguages = Object.freeze([
  'js',
  'git',
  'sql',
  'jsx',
  'tsx',
  'css',
  'bash',
]);

export const createPagination = () => {
  const pagination = [];
  for (let index = 0; index < 5; index++) {
    pagination.push({
      active: false,
      index: index
    });
  }
  return pagination;
}