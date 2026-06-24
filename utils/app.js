// const ald = require('./utils/ald-stat.js')
const { getuserinfoReq, userinfoEditReq } = require("./api/index")
const { getCompanyUserinfo } = require('./api/reqTalent.js')


class rencaiApp {
  constructor(appinit) {

    // this.initData()
  }

  globalData = {
    userInfo: null,
    isModaling: false,
    tabbarHeight: 0
  }

  async initData() {
    console.log('wxLogin in rencai app');
    await this.wxLogin()
    console.log('getLoginUserinfo in rencai app');
    await this.getLoginUserinfo()
    // setTimeout(async () => {
    // console.log('showLoginAndEdit in rencai app');
    // await this.showLoginAndEdit()
    // }, 10 * 1000);
  }

  // 是否授权了信息
  isAuthFun() {
    return new Promise(resolve => {
      let key = wx.getStorageSync('loginUserinfo')
      if (key) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  isLoginInApp() {
    if (wx.getStorageSync('loginUserinfo').userid) {
      return true
    } else {
      return false
    }
  }

  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {

          if (res.code) {
            // console.log(res.code, 'res.code');

            this.globalData.login_code = res.code
            resolve(res)
          } else {
            reject({ code: 999, msg: '登录失败 WX-login success' })
          }
        },
        fail: () => {
          reject({ code: 999, msg: '登录失败 WX-login fail' })
        }
      })
    })
  }

  gopath(url, index = 1) {
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
  }

  toast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    });
  }

  async getLoginUserinfo() {
    let userinfo = wx.getStorageSync('loginUserinfo') || {}
    if (userinfo.userid) {
      const res = await getuserinfoReq({ userid: userinfo.userid })
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
  }

  showLoginAndEdit() {
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
    // console.log(obj, 'eee');
    if (obj.isNeed && !this.globalData.isModaling) {
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
  }

  judgeIsNeedEdit() {
    let isboss = wx.getStorageSync('isBoss')
    if (isboss == 1) {
      let edit_companyinfo = wx.getStorageSync('edit_companyinfo')
      if (!edit_companyinfo || !edit_companyinfo.company || !edit_companyinfo.introduce || !edit_companyinfo.telephone) {
        return { isNeed: true, path: '/pages/AQiyeduan/editInfo_company/editInfo' }
      }
    } else if (isboss == 2) {
      let edit_userinfo = wx.getStorageSync('edit_userinfo')
      if (!edit_userinfo || !edit_userinfo.truename || !edit_userinfo.title) {
        return { isNeed: true, path: '/pages/ARencaiduan/editInfo_talent/editInfo_talent' }
      }
    }

    return { isNeed: false }

  }

  async updateUserStorage(type = 1) {
    let obj = wx.getStorageSync('loginUserinfo')
    let data = {
      userid: obj.userid
    }
    let res

    switch (type) {
      case 1:
        res = await getuserinfoReq(data)
        console.log(res, 'app.updateUserStorage() paindex');
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

  }

  matchStr(str, type = 1) {
    var reg = new RegExp("[\\u4E00-\\u9FA5\\d]", "ig");
    // console.log(str, 'str');

    if (type == 2) {
      // console.log(str, 'str');
      let matchstr = str.match(reg)
      if (!matchstr) {
        return 0
      } else {
        // console.log(matchstr.join('').length, 'matchstr');
        return matchstr.join('').length
      }
    } else {
      if (reg.test(str)) {
        return str
      } else {
        return ''
      }
    }
  }

}

module.exports = {
  rencaiApp
}