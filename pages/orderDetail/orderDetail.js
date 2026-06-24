// const { evokePaymentReq } = require("../../api/index")

// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.id,
      user_id: wx.getStorageSync('loginUserinfo').userid
    })
  },

  async payMoney(){
    const res =  await evokePaymentReq({
      order_id: this.data.order_id,
      user_id: this.data.user_id
    })
    console.log(res, 'res');
    if (res.data.code === 1) {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success: res => {
          console.log(res, 'res');
        },
        fail: res => {
          console.log(res, 'fail');
        },
        complete: res => {
          console.log(res, 'complete');
        }
      }) 
    }
  }

})