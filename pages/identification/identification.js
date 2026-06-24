
const app = getApp().rencaiApp
const { getCompanyUserinfo, getLineResume } = require('../../utils/api/reqTalent')
const { Query } = require('../../utils/index')
let query = new Query()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query.clear()
    if (options.tab) {
      this.setData({
        currentTab: options.tab
      })
    }

    this.setData({
      companyinfoSync: wx.getStorageSync('edit_companyinfo'),
      userinfoSync: wx.getStorageSync('edit_userinfo'),
    })
    console.log( wx.getStorageSync('loginUserinfo'),"用户信息")
    let is_first=wx.getStorageSync('loginUserinfo').is_first
    //判断用户是否第一次注册登录
    wx.setStorageSync('is_first',is_first)
  },

  async goindex(e){
    const { index } = e.currentTarget.dataset
    //console.log(e)
    // if ((this.data.currentTab == index) && this.data.companyinfoSync && this.data.userinfoSync) {
    //   return
    // }
    let res, data = {userid: wx.getStorageSync('loginUserinfo').userid}
 
    if (index == 1) {
      res = await getCompanyUserinfo(data)
      if (res.data.code === 1) {
        wx.setStorageSync('edit_companyinfo', res.data.data)
      }
    }else{
      res = await getLineResume(data)
      if (res.data.code === 1) {
        wx.setStorageSync('edit_userinfo', res.data.data)
      }
    }
    app.gopath(`/pages/pageIndex/pageIndex?currentTabbarIndex=1&isBoss=${index}&from=identification`, 2)
  },

   /**
   * 分享微信好友
   * @returns {{path: string, title: string}}
   */
  onShareAppMessage: function () {
    return {
      title: '成为纺织人首选的求职、招聘平台~',
      path: `/pages/identification/identification`
    }
  },
  /**
   * 分享朋友圈
   * @returns {{query: string, title: string}}
   */
  onShareTimeline: function(){
    return {
      title: '成为纺织人首选的求职、招聘平台~',
      query: ``
    }
  }


})