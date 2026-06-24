import { loginphoneReq } from '../../utils/api/index'
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    login_code: '',
    phoneLoginTime: 0
  },
  onLoad(options) {
    app.globalData.isModaling = true
    this.setData({
      form: options.form
    })
    // console.log(wx.getStorageSync('login_code'),"code")
    // this.setData({
    //   login_code:wx.getStorageSync('login_code')
    // })

  },

  async phoneLogin(e) {
    // 如果当前方法进入了两次或两次以上， 需要return，不然会死循环
    console.log(e, "34444")
    if (this.data.phoneLoginTime > 3) {
      return wx.showModal({
        content: "登录失败,请重新点击登录",
        confirmColor: "#26BA8D",
        success: (res) => {
          if (res.confirm) {
            app.gopath('/pages/phoneLogin/phoneLogin', 2)
          }
        },
      })
    }

    this.setData({
      phoneLoginTime: this.data.phoneLoginTime + 1
    })
    let data = {
      phonestring: JSON.stringify(e.detail),
      code: app.globalData.login_code,
      userstring: wx.getStorageSync('authUserinfoDetail'),
      // from: 'dxt'
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    console.log(data, "data000000")
    const res = await loginphoneReq(data)
    wx.hideLoading()
    console.log(res, "返回res")
    if (res.data.msg === 'code错误') {
      await app.wxLogin()
      // await app.newlogin()
      this.phoneLogin(e)
      console.log('loginStorage');
      // getphonenumber()
    } else if (res.data.code === 1) {
      wx.setStorageSync('loginUserinfo', res.data.data)
      // app.gopath('/pages/pageIndex/pageIndex?currentTabbarIndex=' + 2, 2)
      if (this.data.form == 'active') {
        wx.navigateBack({
          delta: 1
        })
      } else {
        app.gopath('/pages/identification/identification', 2)
      }
      // wx.navigateBack()
    } else {
      wx.showModal({
        content: "登录失败,请重新点击登录",
        confirmColor: "#26BA8D",
        success: (res) => {
          if (res.confirm) {
            app.gopath('/pages/phoneLogin/phoneLogin', 2)
          }
        },
      })
    }
  },

  getphonenumber: async function (e) {
    console.log(e, 'eee2');
    await app.wxLogin()
    if (e.detail.encryptedData && e.detail.iv) {
      await this.phoneLogin(e)
    } else {
      // wx.removeStorageSync('authUserinfoDetail')
      app.toast('拒绝授权!')
    }
  },



  getuserinfo: function (e) {

    wx.getUserProfile({
      desc: '获得最佳体验', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res, "res1111")
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        if (res.errMsg == "getUserProfile:ok") {
          wx.setStorageSync('authUserinfoDetail', JSON.stringify(res))
          this.setData({
            step: 2
          })
        }
      }
    })

    // console.log(e,"eeeeee")
    //     if (e.detail.errMsg == "getUserInfo:ok") {
    //       wx.setStorageSync('authUserinfoDetail', JSON.stringify(e.detail))
    //       this.setData({
    //         step: 2
    //       })
    //     }
  },
  hiddenMask() {
    this.setData({
      step: 1
    })
  }
})