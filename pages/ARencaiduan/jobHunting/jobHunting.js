const {
  config
} = require("../../../utils/wxRequest")
const {
  getJobHuntingReq,
  userEditResumeReq,
  delJobHuntingReq
} = require("../../../utils/api/reqTalent")
const {
  searchNameWithid,
  Addpost
} = require("../../../utils/index")

let addpost = new Addpost()
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logininfo: {},
    jobhuntings: [],
    situationOptions: [],
    situationIndex: 0,
    loadingtext: '暂无数据',
    isDelete: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let soptions = config.situation
    let edituserinfo = wx.getStorageSync('edit_userinfo')
    this.setData({
      logininfo: wx.getStorageSync('loginUserinfo'),
      situationIndex: parseInt(edituserinfo.situation) || 0,
      situationOptions: soptions,
      itemid: edituserinfo.itemid
    })
    await addpost.getData()
    await this.getJobHuntingList()
  },
  async deleteItem(e) {
    console.log(e, "删除操作")
    var id=e.currentTarget.dataset.id
    const res = await delJobHuntingReq({
      id: id
    })
    await this.getJobHuntingList()
    console.log(res,"ressssss")
  },

  async getJobHuntingList() {
    this.setData({
      loadingtext: '加载中'
    })
    const res = await getJobHuntingReq({
      userid: this.data.logininfo.userid
    })
    if (res.data.code === 1) {
      console.log(res.data, 'res.data');
      let obj = res.data.data
      obj.forEach(item => {
        // console.log(addpost.get().catid, 'addpost.get().catid', item.catid);
        const catname = searchNameWithid(addpost.get().catid, item.catid, 'catname')
        const xinzi = searchNameWithid(addpost.get().xinzi, item.xinzi, 'name')
        // console.log(xinzi, 'xinzi');
        // console.log(catname, 'catname');
        item.catname = catname
        item.xinzivalue = xinzi
      });
      obj = obj.splice(0, 3)
      this.setData({
        jobhuntings: obj
      })
    }
    this.setData({
      loadingtext: ''
    })
  },

  gopath(e) {
    const {
      url
    } = e.currentTarget.dataset
    if (/addJobHunting/.test(url) && this.data.jobhuntings.length >= 3) {
      return wx.showModal({
        title: "提示",
        content: "只能填加三个求职意向!",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000"
      })
    }
    app.gopath(url)

  },

  gotoEdit(e) {
    const {
      item
    } = e.currentTarget.dataset
    let huntingItem = JSON.stringify(item)
    let url = '/pages/ARencaiduan/addJobHunting/addJobHunting?huntingItem=' + huntingItem
    app.gopath(url)
  },

  pickerChange(e) {
    console.log(e,"删除")
    wx.showModal({
      title: "提示",
      content: "确定修改求职状态吗?",
      confirmColor: "#26BA8D",
      confirmText: "修改",
      cancelText: "再想想",
      cancelColor: "#000",
      success: async (res) => {
        if (res.confirm) {
          const res = await userEditResumeReq({
            itemid: this.data.itemid,
            situation: parseInt(e.detail.value)
          })
          if (res.data.code === 1) {
            app.toast('操作成功!')
            this.setData({
              situationIndex: parseInt(e.detail.value)
            })
            let edinfo = wx.getStorageSync('edit_userinfo')
            edinfo.situation = parseInt(e.detail.value)
            edinfo.situationinfo = this.data.situationOptions[parseInt(e.detail.value)].name
            wx.setStorageSync('edit_userinfo', edinfo)
          }
        }
      },
    })

  },

  onPullDownRefresh() {
    this.getJobHuntingList()
  }
})