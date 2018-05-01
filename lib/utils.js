const filterOptionsArg = args =>
  args.filter((arg, i) => {
    if (i === 2 && typeof arg === 'object') {
      return false;
    }
    return true;
  });

const timeout = () => 40000;

module.exports = {filterOptionsArg, timeout};
