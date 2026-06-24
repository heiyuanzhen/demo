const { getJobListReq, deleteZpingReq } = require("../../../utils/api/reqTalent");

const app = getApp().rencaiApp


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    postItems: [],
    currentPage: 1,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: wx.getStorageSync('loginUserinfo')
    })
    this.getJobList()
  },

  deleteItem(e){
    
    wx.showModal({
      title: "提示",
      content: "确认要删除吗",
      confirmColor: "#26BA8D",
      confirmText: "删除",
      cancelText: "再想想",
      cancelColor: "#000",
      success: async (res) => {
        if (res.confirm) {
          const resp = await deleteZpingReq({job_id: e.detail})
          if (resp.data.code === 1) {
            app.toast('删除成功!')
            this.getJobList()
          }else{
            app.toast(res.data.msg)
          }
        }
      },
    })
  },
  gopath(e) {
    
    const { url, id } = e.currentTarget.dataset
    console.log(url, id, 'url id isMyself');
    let subString = url
    if (id) {
      subString = `${url}?id=${id}`
    }
    app.gopath(subString)
  },

  async getJobList(querySync = {}){
    console.log('recruiment eeee,ee');
      
    // this.setData({
    //   loadingText: '正在加载,稍等片刻...'
    // })
    let data = Object.assign({
      page: this.data.currentPage,
      username: this.data.userinfo.username
    }, querySync)
    const res = await getJobListReq(data)
    console.log(res, 'res');

    if (res.data.code === 1) {
      try {
        let list = res.data.data.data || []
        if (this.data.userinfo.isVip==0) {
          list = list.splice(0, 3)
        }
        this.setData({
          postItems: list
        })
      } catch (error) {
        console.log(error, 'error');
        this.setData({
          postItems: [],
        })
      }
    }
  },

  onPullDownRefresh: function () {
    this.getJobList()
    wx.stopPullDownRefresh()
  },


})