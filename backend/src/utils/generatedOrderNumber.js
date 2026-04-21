const generateOrderNumber = (id) => {
  return `NZ-${1000 + id}`;
};

module.exports = generateOrderNumber;