// const ald = require('./utils/ald-stat.js')
const {
  getuserinfoReq,
  userinfoEditReq
} = require("./utils/api/index")
const {
  getCompanyUserinfo
} = require('./utils/api/reqTalent.js')
const {
  rencaiApp
} = require('./utils/app.js');
const {
  _http
} = require('./utils/wxRequest')

App({
  onLaunch: async function () {
    // 展示本地存储能力
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
      wx.clearStorageSync()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })

    await this.wxLogin()
    // await this.newlogin()
    await this.getLoginUserinfo()
    // setTimeout(async () => {
    //   await this.showLoginAndEdit()
    // }, 10 * 1000);

  },
  globalData: {
    userInfo: null,
    isModaling: false,
    tabbarHeight: 0,
    login_code: ''
  },
  rencaiApp: new rencaiApp(true),
  // 是否授权了信息
  isAuthFun: function () {
    return new Promise(resolve => {
      let key = wx.getStorageSync('loginUserinfo')
      if (key) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  },
  // 授权确认
  authModal: () => {

  },
  isLoginInApp: function () {
    if (wx.getStorageSync('loginUserinfo').userid) {
      return true
    } else {
      return false
    }
  },
  wxLogin: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          console.log(res, "res111111111")
          if (res.code) {
            console.log(res.code, 'res.code');
            this.globalData.login_code = res.code
            wx.setStorageSync('login_code', res.code)
            resolve(res)
          } else {
            reject({
              code: 999,
              msg: '登录失败 WX-login success'
            })
          }
        },
        fail: () => {
          reject({
            code: 999,
            msg: '登录失败 WX-login fail'
          })
        }
      })
    })
  },

  gopath: function (url, index = 1) {
    url = url.startsWith('/') ? url : `/${url}`
    if (index == 1) {
      wx.navigateTo({
        url
      })
    } else if (index == 2) {
      wx.redirectTo({
        url
      })
    } else {
      wx.switchTab({
        url
      })
    }
  },

  toast: (text) => {
    wx.showToast({
      title: text,
      icon: 'none'
    });
  },

  getLoginUserinfo: async function () {
    let userinfo = wx.getStorageSync('loginUserinfo') || {}
    if (userinfo.userid) {
      const res = await getuserinfoReq({
        userid: userinfo.userid
      }) 
      if (res.data.code === 1) {
        wx.setStorageSync('loginUserinfo', res.data.data)
      } else {
        wx.removeStorageSync('loginUserinfo')
        wx.showModal({
          title: "提示",
          content: "请重新登录~",
          confirmColor: "#26BA8D",
          confirmText: "去登陆",
          cancelText: "再看看",
          cancelColor: "#000",
          success: (res) => {
            if (res.confirm) {
              this.gopath('/pages/phoneLogin/phoneLogin')
            }
          },
        })
      }
    }
  },



  showLoginAndEdit: async function () {
    /* 判断是否登录
      1. 未登录
        1.1 10秒发起modal， 确认登录 -> 跳转登录页 取消 -> 再次添加定时器10秒执行
      2. 已登录
    */
    if (!this.isLoginInApp() && !this.globalData.isModaling) {
      this.globalData.isModaling = true
      wx.showModal({
        title: "提示",
        content: "请前往登录~",
        confirmColor: "#26BA8D",
        confirmText: "去登陆",
        cancelColor: "#000",
        success: (res) => {
          this.globalData.isModaling = false
          if (res.confirm) {
            this.gopath('/pages/phoneLogin/phoneLogin')
          }
          // else{
          //   setTimeout(() => {
          //     this.showLoginAndEdit()
          //   }, 10 * 1000);
          // }
        },
      })
      return false
    }
    let obj = this.judgeIsNeedEdit()
    console.log(obj, 'eee');
    let isboss = wx.getStorageSync('isBoss')
    if (obj.isNeed && !this.globalData.isModaling && isboss != 1) {
      this.globalData.isModaling = true
      wx.showModal({
        title: "提示",
        content: "请前往完善信息~",
        confirmColor: "#26BA8D",
        confirmText: "去完善",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          this.globalData.isModaling = false
          if (res.confirm) {
            this.gopath(obj.path)
          }
          // else{
          //   this.showLoginAndEdit()
          // }
        },
      })
      return false
    }
    return true
  },

  judgeIsNeedEdit: function () {
    let isboss = wx.getStorageSync('isBoss')
    if (isboss == 1) {
      let edit_companyinfo = wx.getStorageSync('edit_companyinfo')
      if (!edit_companyinfo || !edit_companyinfo.company || !edit_companyinfo.introduce || !edit_companyinfo.telephone) {
        return {
          isNeed: true,
          path: '/pages/AQiyeduan/editInfo_company/editInfo'
        }
      }
    } else if (isboss == 2) {
      let edit_userinfo = wx.getStorageSync('edit_userinfo')
      if (!edit_userinfo || !edit_userinfo.truename || !edit_userinfo.title) {
        return {
          isNeed: true,
          path: '/pages/ARencaiduan/editInfo_talent/editInfo_talent'
        }
      }
    }

    return {
      isNeed: false
    }

  },

  updateUserStorage: async function (type = 1) {
    let obj = wx.getStorageSync('loginUserinfo')
    let data = {
      userid: obj.userid
    }
    let res

    switch (type) {
      case 1:
        res = await getuserinfoReq(data)
        if (res.data.code === 1 && res.data.data) {
          wx.setStorageSync("loginUserinfo", res.data.data)
        }
        break;
      case 2:
        res = await userinfoEditReq(data)
        if (res.data.code === 1 && res.data.data) {
          wx.setStorageSync("edit_userinfo", res.data.data)
        }
        break;
      case 3:
        res = await getCompanyUserinfo(data)
        if (res.data.code === 1 && res.data.data) {
          wx.setStorageSync("edit_companyinfo", res.data.data)
        }
        break;

    }

  },
  _http: _http

})