const { talentListReq, collectionResume, contactTalentReq } = require("../../../utils/api/index")
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {

    talentList: [],
    currentIndex: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loginUserinfo: wx.getStorageSync('loginUserinfo') || {}
    })

    this.tabitemClick(this.data.currentIndex)
  },


  gopath(e) {
    const { url, pathtype = 1, id } = e.currentTarget.dataset

    let subString = url
    if (id) {
      subString = `${url}?id=${id}`
    }
    app.gopath(subString, pathtype)
  },

  async tabitemClick(e) {
    console.log(e, 'eee');
    let index
      // 1. (string || number) 2. object
    if (typeof(e) === 'string' || typeof(e) === 'number') {
      index = parseInt(e)
    } else {
      index = e.currentTarget.dataset.index
    }

    this.setData({
      currentIndex: index
    })

    // 已收藏人才
    let obj = this.data.loginUserinfo
    if (obj.userid) {
      const res = await talentListReq({ userid: obj.userid, tab: index })
      console.log(res.data, 'talentList');
      this.setData({
        talentList: res.data.data.data,
        total: res.data.data.total
      })

    } else {
      this.setData({
        talentList: []
      })
    }
  },

  handleCancelClick(e) {
    wx.showModal({
      title: '提示',
      content: '你确定要取消收藏该人才吗?',
      confirmColor: '#26BA8D',
      cancelText: '再想想',
      success: async res => {
        if (res.confirm) {
          console.log(e, 'eee');
          const { id } = e.currentTarget.dataset
          const res = await collectionResume({
            resume_id: id,
            user_id: this.data.loginUserinfo.userid
          })
          console.log(res, 'res');
          if (res.data.code === 1) {
            wx.showToast({
              title: '取消成功',
              icon: 'none'
            });
            this.tabitemClick(2)
          }
        }
      }
    })

  },
  async deleteItem(e) {
    wx.showModal({
      title: '提示',
      content: '你确定要删除该记录吗?',
      confirmColor: '#26BA8D',
      cancelText: '再想想',
      success: async res => {
        if (res.confirm) {
          await contactTalentReq({
            user_id: this.data.loginUserinfo.userid,
            is_del: 1,
            resume_id: e.detail
          })
          this.tabitemClick(this.data.currentIndex)
        }
      }
    })

  },

  refreshTalentList() {
    this.tabitemClick(this.data.currentIndex)
  }

})