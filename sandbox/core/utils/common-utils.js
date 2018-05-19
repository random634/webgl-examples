module.exports = {
  isPowerOf2 : function (value) {
    return (value & (value - 1)) == 0;
  }
}