/**
 * 节流函数
 */
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments[0];
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

/**
 * 校验手机号
 */
function checkMobile(phone) {
  if (!/^1[3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
    Toast("手机号格式不正确")
    return true
  }
}
/**
 * 提示toast
 */
function Toast(data) {
  wx.showToast({
    title: data,
    icon: 'none'
  })
}



module.exports = {
  debounce,
  checkMobile,
  Toast,

}