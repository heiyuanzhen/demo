var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: {
      type: Object,
      value: []
    },

  },
  /**
   * 组件的初始数据
   */
  data: {
    height: 200,
    width: 690,
    subscriptionComponentVisible: false,
    slideshow: [],
    current: 0,
    cur: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    viewDetail: function (e) {
      console.log(e, "banner信息")
      const {
        linkurl,
        type,
        appid,
      } = e.currentTarget.dataset
      if (type == 1) {
        wx.navigateTo({
          url: '/' + linkurl,
        })

      }else if (type==3) {
        wx.navigateToMiniProgram({
          appId: appid, //要打开的小程序 appId
          path: linkurl,
          success(res) {
          }
        })
      }
    },

    officialAccountLoadError(e) {
      status[e.detail.status] && wx.showToast({
        title: status[e.detail.status],
        icon: 'none'
      })
    },
    swiperCurrentchang(e) {
      // console.log(e, '获取current')
      let {
        current
      } = e.detail
      this.setData({
        current
      })

    },
    swiperChange: function (e) {
      console.log(e, "改变轮播")
      var that = this;
      that.setData({
        swiperCurrent: e.detail.current
      })

    },
    // // 轮播图跳转
    // slideshowClick: async function (e) {
    //   console.log(e, 'eee');

    //   var that = this
    //   let isAuth = await app.judgeAuth()

    //   if (isAuth) {
    //     const resp = await util.isDoneUserInfoTwo()
    //     let a = resp.data.ret
    //     if (a == '未完善') {
    //       wx.navigateTo({
    //         // url: '/pages/personal_data/personal_data'
    //         url: '/pages/phonecode/phonecode?phone=call'
    //       })
    //     } else if (a == '用户不存在!') { //提示授权
    //       app.authShowModal()
    //     } else if (a == '已完善') {
    //       that.setData({
    //         have1: false,
    //         done120: false
    //       })

    //       switch (e.currentTarget.dataset.linktype) {
    //         case 1:
    //           wx.navigateTo({
    //             url: '../../home/store_particulars/store_particulars?id=' + e.currentTarget.dataset.userid,
    //           })
    //           break;
    //         case 2:
    //           wx.navigateTo({
    //             url: '../../home/particulars/particulars?itemid=' + e.currentTarget.dataset.id + '&mid=' + e.currentTarget.dataset.mid,
    //           })
    //           break;
    //         case 3:
    //           //跳h5页面，先判断有没有注册过
    //           if (app.globalData.DTuserInfo.groupid != 6) {
    //             if (app.globalData.DTuserInfo.updating) {
    //               wx.showModal({
    //                 title: '个人信息审核中',
    //                 content: '请等待审核完成',
    //                 showCancel: false
    //               })
    //             } else {
    //               wx.showModal({
    //                 title: '个人信息审核中',
    //                 content: '请等待客服审核完成！',
    //                 showCancel: false
    //               })
    //             }
    //             return;
    //           }
    //           wx.navigateTo({
    //             url: '../webview/index?url=' + e.currentTarget.dataset.url
    //           })
    //           break;
    //         case 4:
    //           break;
    //         case 5: //咨询详情
    //           wx.navigateTo({
    //             url: '../Information_details/Information_details?itemid=' + e.currentTarget.dataset.xinxiid,
    //           })
    //           break;
    //         case 6: //跳转到活动页
    //           wx.navigateTo({
    //             url: e.currentTarget.dataset.url,
    //             fail: (res) => {
    //               wx.switchTab({
    //                 url: e.currentTarget.dataset.url
    //               })
    //             }
    //           })
    //           break;
    //         case 9: //跳转到大学堂 
    //           let appid = e.currentTarget.dataset.appid
    //           let path = e.currentTarget.dataset.url
    //           wx.navigateToMiniProgram({
    //             appId: appid, //要打开的小程序 appId
    //             path: path,
    //             // envVersion: 'develop',
    //             success(res) {
    //               if (that.data.popupImgShow) {
    //                 that.setData({
    //                   popupImgShow: false
    //                 })
    //               }
    //             }
    //           })
    //           break;
    //         case 11:
    //           wx.makePhoneCall({
    //             phoneNumber: this.data.popupImgs[this.data.index].phone
    //           })
    //           break;
    //         case 12:
    //           that.setData({
    //             subscriptionComponentVisible: true
    //           })
    //           break;
    //       }
    //     } else if (a == '手机号为空') {
    //       that.setData({
    //         have1: true,
    //         done120: that.data.done120
    //       })
    //     } else {
    //       that.setData({
    //         have1: true,
    //         done120: true
    //       })
    //     }
    //   } else {
    //     app.authShowModal()
    //   }

    // },

  },


})