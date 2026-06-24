const { getuserinfoReq } = require("../../../utils/api/index")
const { userStaReq } = require("../../../utils/api/reqTalent")

const app = getApp().rencaiApp

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  
  lifetimes: {
    attached: async function () {
      await this.getLoginuserInfo()
      await this.getUserStaFun()
      const res = wx.getSystemInfoSync()
      var statusbarH = res.statusBarHeight
      this.setData({
          statusbar :statusbarH+10, // 状态栏高度
          jiaonangheight: wx.getMenuButtonBoundingClientRect().height  // 胶囊高度
      })

    },
  },
  
  pageLifetimes: {
    show: async function() {

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginUserinfo: '',
    isLogin: '',
    userStatu: '',
    isTriggerEnd: '',
    situationinfo: '',
    edit_userinfo: ''
  },
  // attached() {
   
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    gopath(e){
      const { url, pathtype = 1, isgologinpath = 2, id, frompath } = e.currentTarget.dataset
      console.log(frompath, 'frompath');
      
      if (!this.data.isLogin && isgologinpath != 1) {
        return wx.showModal({
          content: "请登录",
          confirmColor: "#26BA8D",
          confirmText: "去登陆",
          success: (res) => {
            if (res.confirm) {
              app.gopath('/pages/phoneLogin/phoneLogin')
            }
          },
        })
      }

      let subString = url
      if (id) {
        subString = `${url}?id=${id}`
      }
      if (frompath) {
        subString = `${subString}&frompath=${frompath}`
      }
      
      console.log(subString, 'subString');
      app.gopath(subString, pathtype)
    },

    async getLoginuserInfo() {
      this.setData({
        edit_userinfo: wx.getStorageSync('edit_userinfo')
      })
      
      let userinfo = wx.getStorageSync('loginUserinfo') || {}
      if (userinfo.userid) {
        wx.showLoading({
          title: '登录中...'
        })
        try {
          const res = await getuserinfoReq({ userid: userinfo.userid })
          if (res.data.code === 1) {
            console.log(res.data.data,"返回用户的信息")
            wx.setStorageSync('loginUserinfo', res.data.data)
            this.setData({
              isLogin: true,
              userinfo
            })

          } else {
            wx.clearStorageSync('loginUserinfo')
            wx.showModal({
              title: '提示',
              content: '请重新点击登录~'
            })
          }
          wx.hideLoading()
        } catch (error) {
          console.log(error);
          wx.hideLoading()
        }
      }
      // console.log(this.data.userinfo, 'userinfo用户信息系');
      let loginUserinfo = wx.getStorageSync("loginUserinfo") || {}
      this.setData({
        userinfo: loginUserinfo,
        isLogin: loginUserinfo.userid ? true : false,
        situationinfo: wx.getStorageSync('edit_userinfo').situationinfo,
      })
    },

    logoutit(){
      wx.showModal({
        title: "提示",
        content: "确定要退出登录吗?",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '正在退出...'
            })
            setTimeout(() => {
              wx.hideLoading()
              wx.removeStorageSync('loginUserinfo')
              this.setData({
                loginUserinfo: {},
                isLogin: false,
                userStatu: {}
              })
            }, 1000);
          }
        },
      })
    },

    async pulldownrefresh(){
      await this.getLoginuserInfo()
      await this.getUserStaFun()
      
      setTimeout(() => {
        this.setData({
          isTriggerEnd: false
        })
      }, 1000);
    },

    async getUserStaFun(){
      if (!this.data.isLogin) {
        return
      }
      const res = await userStaReq({
        userid: this.data.userinfo.userid
      })
      console.log(res.data, 'res');
      if (res.data.code === 1) {
        this.setData({
          userStatu: res.data.data
        })
      }
    },

    callUs(e){
      const { phone } = e.currentTarget.dataset
      wx.makePhoneCall({
        phoneNumber: phone,
        success: resp => {
          console.log(resp, 'resp');
        },
        fail: err => {
          // 取消
          console.log(err, 'err');
        }
      })
    }

  }
})
