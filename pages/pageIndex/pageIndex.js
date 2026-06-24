const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBoss: 2,
    currentTabbarIndex: 1,
    isShowPageTwo: false,
    vHeight: '1000rpx',
    showTabbar: true,
    is_first: '',
  },

  scrollEvent(e) {
    // console.log(e.detail, 'e.detail');
  },
  agree(e) {
    console.log("用户同意隐私授权, 接下来可以调用隐私协议中声明的隐私接口")
    wx.getClipboardData({
      success(res) {
        console.log("getClipboardData success", res)
      },
      fail(res) {
        console.log("getClipboardData fail", res)
      },
    })
  },



  disagree(e) {
    console.log("用户拒绝隐私授权, 未同意过的隐私协议中的接口将不能调用")
  },
  onLoad(options) {
    console.log(wx.getStorageSync('is_first'), 'wx.is_first11111111111()');
    //判断用户是否第一次注册登录
    this.setData({
      is_first: wx.getStorageSync('is_first')
    })

    console.log(options, "结果")
    let isBoss
    if (!options.isBoss) {
      let syncIsboss = wx.getStorageSync('isBoss')
      if (syncIsboss) {
        isBoss = syncIsboss
      } else {
        isBoss = this.data.isBoss
      }
    } else {
      isBoss = options.isBoss
    }

    this.setData({
      currentTabbarIndex: options.currentTabbarIndex || 1,
      isShowPageTwo: options.currentTabbarIndex == 2 ? true : false,
      isBoss,
      vHeight: wx.getSystemInfoSync().windowHeight - 1 + 'px',
      // vHeight: '300px'
    })

    wx.setStorageSync('isBoss', this.data.isBoss)

    // 切换方法
    const tabbar = this.selectComponent('#tabbar')
    tabbar.clickTabbar({ isFromLogin: true, index: this.data.currentTabbarIndex })


  },

  // clickTabbar(e){
  //   const { index } = e.currentTarget.dataset
  //   this.setData({
  //     currentTabbarIndex: index
  //   })
  // },

  clicktabbar(e) {
    const { index } = e.detail.currentTarget.dataset
    if ((index + 1) == 2 && !this.data.isShowPageTwo) {
      this.setData({
        isShowPageTwo: true
      })
    }

    // console.log((index, 'index');
    this.setData({
      currentTabbarIndex: index + 1
    })
  },

  onPullDownRefresh: function () {
    // console.log(('onPullDownRefresh');

    // 如有需要请在json文件中开启
    // "enablePullDownRefresh": true,
    // "onReachBottomDistance": 50
  },

  ao() {
    app.gopath('/pages/pageIndex/pageIndex?currentTabbarIndex=2&isBoss=1')
  },

  // vHeightChange(e){
  //   console.log(e, 'ee');
  //   return
  //   this.setData({
  //     vHeight: `${e.detail}rpx`
  //   })
  // },

  toggleTabbar(e) {
    this.setData({
      showTabbar: e.detail
    })
  },

  onShow() {
    console.log('hideHomeButton', 'hideHomeButton');
    wx.hideHomeButton({
      success: res => {
        console.log(res, 'res');
      },
      fail: err => {
        console.log(err, 'err');
      }
    })
  },

  /**
   * 分享微信好友
   * @returns {{path: string, title: string}}
   */
  onShareAppMessage: function () {
    return {
      title: '成为纺织人首选的求职、招聘平台~',
      path: `/pages/pageIndex/pageIndex`
    }
  },
  /**
   * 分享朋友圈
   * @returns {{query: string, title: string}}
   */
  onShareTimeline: function () {
    return {
      title: '成为纺织人首选的求职、招聘平台~',
      query: ``
    }
  }
})