const { resumeDetailReq, collectionResume, contactTalentReq } = require("../../../utils/api/index")
const { singePriceReq } = require("../../../utils/api/reqTalent")
const { PayForVip } = require('../../../utils/pay')

const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isstar: true,
    rcid: '',
    showDialog: false,
    resumeDetail: {},
    isVip: false,
    user_id: '',
    ismyself: false,
    singlePrice: '12.63',
    isgoumai: false,
    is_fee: 0,

    showList: [
      { index: 0, isAll: false },
      { index: 1, isAll: false },
      { index: 2, isAll: false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'opt');
    if (options.type == 1) {  //如果是编辑成功之后跳转到此页面
      options.frompath = 'minepage'
    }
    let obj = wx.getStorageSync('loginUserinfo')
    let obj2 = wx.getStorageSync('edit_userinfo')
    this.setData({
      rcid: options.id || '',//人才简历的id
      user_id: obj.userid,  //登陆者的id
      edit_userinfo_id: obj2.itemid,
      userinfoLogin: obj,
      frompath: options.frompath || ''
    })

    this.getResumeDetail()
  },
  async getResumeDetail() {
    const res = await resumeDetailReq({
      resume_id: this.data.rcid,
      user_id: this.data.user_id
    })
    console.log(res.data, "11111111")
    if (res.data.code === 1) {
      let resumeDetail = res.data.data
      let ismyself = this.data.edit_userinfo_id == this.data.rcid ? true : false
      if (this.data.userinfoLogin.isVip != 1 && !ismyself) {
        if (resumeDetail.is_goumai != 1) {
          resumeDetail.truename = resumeDetail.truename.substring(0, 1) + '**'
        }
      }

      resumeDetail.worklist = app.matchStr(resumeDetail.worklist)
      resumeDetail.stulist = app.matchStr(resumeDetail.stulist)
      resumeDetail.introduce = app.matchStr(resumeDetail.introduce)

      resumeDetail.worklistLength = app.matchStr(resumeDetail.worklist, 2)
      resumeDetail.stulistLength = app.matchStr(resumeDetail.stulist, 2)
      resumeDetail.introduceLength = app.matchStr(resumeDetail.introduce, 2)

      // let thumb
      // try {
      //   thumb = resumeDetail.thumb || this.data.userinfoLogin.avatarUrl
      // } catch (error) {
      //   thumb = ''
      // }
      // resumeDetail.thumb = thumb

      this.setData({
        resumeDetail,
        ismyself,
        is_fee: res.data.data.is_fee
      })
      //      console.log(this.data.is_fee, 'is_fee')
    } else {
      wx.showModal({
        title: "提示",
        content: "简历不存在！",
        confirmColor: "#26BA8D"
      })
      wx.navigateBack()
    }

  },

  async clickIconTap() {
    const res = await collectionResume({
      resume_id: this.data.rcid,
      user_id: this.data.user_id
    })
    if (res.data.code === 1) {
      await this.getResumeDetail()
      if (res.data.msg == '取消收藏') {
        wx.showToast({
          title: '取消成功!',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: '收藏成功!',
        });
      }
    }

  },

  sendMessage(e) {
    // 判断是否登录
    let isLogin = app.isLoginInApp()
    if (!isLogin) {
      return app.gopath('/pages/phoneLogin/phoneLogin')
    }
    // 联系他
    const { phone } = e.currentTarget.dataset

    //is_fee = 0时为不在免费时间段  is_fee = 1时为尚可联系5人  is_fee = 2时今日次数已用完毕
    if (this.data.is_fee == 1) {
      wx.makePhoneCall({
        phoneNumber: phone,
        success: async res => {
          console.log(res, 'res');
          let data = {
            user_id: this.data.user_id,
            resume_id: this.data.rcid
          }
          const resp = await contactTalentReq(data)
        },
        fail: err => {
          // 取消
          console.log(err, 'err');
        }
      })
    } else if (this.data.is_fee == 2) {
      let that = this
      wx.showModal({
        title: "提示",
        content: "您今日限免联系人才次数已用完~",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            setTimeout(function () {
              that.toggleDialogShow()
            }, 1100)
          }
        },
      })
    } else {
      if ((this.data.userinfoLogin && this.data.userinfoLogin.isVip == 1) || this.data.resumeDetail.is_goumai == 1) {
        wx.makePhoneCall({
          phoneNumber: phone,
          success: async res => {
            console.log(res, 'res');
            let data = {
              user_id: this.data.user_id,
              resume_id: this.data.rcid
            }
            const resp = await contactTalentReq(data)
            console.log(resp, 'resp');
            // if (resp.data.code === 1) {

            // }
          },
          fail: err => {
            // 取消
            console.log(err, 'err');
          }
        })
      } else {
        this.toggleDialogShow()
      }
    }




  },

  onShareAppMessage: function () {
    return {
      title: '邀您查看人才详情~',
      path: '/pages/AQiyeduan/talentDetail/talentDetail?id=' + this.data.rcid
    }
  },

  catchtap() {
    return
  },

  async toggleDialogShow() {
    this.setData({
      showDialog: !this.data.showDialog
    })
    if (this.data.showDialog) {
      wx.showLoading()
      const res = await singePriceReq()
      if (res.data.code === 1) {
        this.setData({
          singlePrice: res.data.data.price
        })
      }
      wx.hideLoading()
    }
  },

  // 生成订单详情
  async getOrderDetail() {
    const res = await PayForVip()
    console.log(res, 'PayForVip');
    if (res.errMsg = "requestPayment:ok" && (res && res.code !== 999)) {
      console.log(res, 'res');
      // 处理支付成功之后的逻辑
      app.toast('尊敬的用户，您已经是会员!')
    } else if (res.code === 999) {
      app.toast('支付失败')
    }
  },

  gopath(e) {

    // this.toggleDialogShow()
    // return

    const { url } = e.currentTarget.dataset
    app.gopath(url)
  },

  async buyOne() {
    let data = {
      price: this.data.singlePrice,
      resume_id: this.data.resumeDetail.itemid,
      vip_level: 0
    }
    const res = await PayForVip(3, data)
    console.log(res, 'res');
    if (res.code === 1) {
      this.getResumeDetail()
      wx.showModal({
        title: "支付成功!",
        content: "去查看人才信息~",
        confirmColor: "#26BA8D",
        confirmText: "查看",
        success: (res) => {
          if (res.confirm) {
            this.toggleDialogShow()
          }
        },
      })
    } else {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      });
    }
  },

  toggleShoAll(e) {
    const { index } = e.currentTarget.dataset
    let list = this.data.showList
    list[index].isAll = !list[index].isAll
    console.log(list, 'list');

    this.setData({
      showList: list
    })
  },

  callKf(e) {
    const { phone } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }

})