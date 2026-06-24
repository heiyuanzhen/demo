const {
  vipListDetailReq
} = require("../../../utils/api/reqTalent");
const {
  PayForVip
} = require("../../../utils/pay");
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    currentIndex: 0,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      loginUserinfo: wx.getStorageSync('loginUserinfo'),
      id: options.id ? options.id : ''
    })
    await this.getVipList()

  },

  async getVipList() {
    const res = await vipListDetailReq({
      id: this.data.id
    })
    if (res.data.code === 1) {
      this.setData({
        imgUrls: res.data.data
      })
    }
  },

  swiperItemChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  async buyVip() {
    let i = this.data.currentIndex
    let item = this.data.imgUrls[i]
    let buytype = this.data.loginUserinfo.isVip ? 2 : 1
    let data = {
      price: item.price,
      resume_id: 0,
      vip_level: item.id
    }
    const res = await PayForVip(buytype, data)
    console.log(res, 'res11111111111');
    if (res.code === 1) {
      wx.showModal({
        title: "支付成功!",
        content: "去查看人才信息~",
        confirmColor: "#26BA8D",
        confirmText: "查看",
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack()
          }
        },
      })
    } else if (res.code == 2) {
      wx.showToast({
        title: '已经购买过啦~',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: res.toastmsg,
        icon: 'none'
      });
    }
  }
})