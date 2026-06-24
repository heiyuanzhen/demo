const { getJobListReq, contactJobReq } = require("../../../utils/api/reqTalent");
const app = getApp().rencaiApp

// pages/ARencaiduan/furrowPassage/furrowPassage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postItems: [],
    bartitle: {
      '1': { title: '沟通过的职位' }, 
      '2': { title: '已投递的职位' }, 
      '3': { title: '您收藏的职位' }, 
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.index
    this.setData({
      index
    })
    wx.setNavigationBarTitle({
      title: this.data.bartitle[index].title
    })
    this.getJobList({tab: index})
  },
  
  deleteItem(e){
    let id = e.detail
    wx.showModal({
      title: "提示",
      content: "确认要删除吗",
      confirmColor: "#26BA8D",
      confirmText: "删除",
      cancelText: "再想想",
      cancelColor: "#000",
      success: async (res) => {
        if (res.confirm) {
          const resp = await contactJobReq({job_id: id, is_del: 1, user_id: wx.getStorageSync('loginUserinfo').userid})
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

  async getJobList(querySync = {}) {

    // this.setData({
    //   loadingText: '正在加载,稍等片刻...'
    // })
    let data = Object.assign({
      userid: wx.getStorageSync('loginUserinfo').userid
    }, querySync)
    const res = await getJobListReq(data)
    console.log(res, 'res');

    if (res.data.code === 1) {
      let postItems = res.data.data.data
      postItems.forEach(item => {
        item.p_time = item.edittime ? item.edittime.split(' ')[0] : item.edittime
      });
      try {
         this.setData({
          postItems: res.data.data.data,
          // postItems: [],
        })
      } catch (error) {
        this.setData({
          postItems: [],
        })
      }
    }
  },

  gopath(e) {
    const { url, id } = e.currentTarget.dataset
    console.log(url, id, 'url id');
    let subString = url
    if (id) {
      subString = `${url}?id=${id}`
    }
    app.gopath(subString)
  },
})