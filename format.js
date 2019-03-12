module.exports = {
  numberWithCommas: function (x) {
    if(!isNaN(x)) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      return x;
    }
  }
}
