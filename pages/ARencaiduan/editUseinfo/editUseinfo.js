const {
  userinfoEditReq
} = require("../../../utils/api/index");
const {
  uploadgai
} = require("../../../utils/index");
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyinfo: {
      img: '',
      truename: '',
      mobile: ''
    },
    resultImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = wx.getStorageSync('loginUserinfo') || {}
    let companyinfo = {
      img: obj.avatarUrl || '',
      truename: obj.truename || '',
      mobile: obj.mobile || ''
    }
    let isboss = wx.getStorageSync('isBoss')
    this.setData({
      companyinfo,
      loginuserinfo: obj,
      isboss: isboss
    })


  },
  onShow(){
   if(this.data.resultImage !==''){
     this.data.companyinfo.img=this.data.resultImage
   }
   this.setData({
     companyinfo:this.data.companyinfo
   })

  },

  uploadAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        console.log(res, 'chooseImage');
        const res2 = await uploadgai({
          file: res.tempFilePaths[0]
        }, true)
       console.log(res2.ret,"头像信息")
        wx.navigateTo({
          url: '/pages/uploadAvatar/uploadAvatar?src=' + res2.ret
        })
      }
    })
  },

  changeCompanyInfo(e) {
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`companyinfo.${key}`]: e.detail.value
    })
  },

  async userinfoEditFun() {
    const res = await userinfoEditReq({
      userid: this.data.loginuserinfo.userid,
      avatarUrl: this.data.companyinfo.img,
      truename: this.data.companyinfo.truename
    })
    if (res.data.code === 1) {
      app.toast('编辑成功!')
      app.updateUserStorage()
      wx.redirectTo({
        url: '/pages/pageIndex/pageIndex?currentTabbarIndex=2',
      })
    } else {
      app.toast(res.data.msg)
    }
  }
})