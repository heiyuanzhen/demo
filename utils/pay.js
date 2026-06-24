import { createVipOrderReq, evokePaymentReq, getDxtOpenidReq } from './api/index'

const app = getApp().rencaiApp
// let user_id = wx.getStorageSync('loginUserinfo').userid

// 生成订单详情
export const PayForVip = async (buytype = 1, otherParam = false) => {
  console.log('showloading');
  wx.showLoading()
  setTimeout(() => {
    wx.hideLoading()
  }, 5000);
  const { vip_level, price, resume_id } = otherParam
  // 判断是否登录
  const isLogin = app.isLoginInApp()
  if (!isLogin) {
    app.toast('请登录!')
    app.gopath('/pages/phoneLogin/phoneLogin?from=active')
    return
  }

  console.log('last');

  // 生成订单(传入openid)，请求接口（userid, 购买（buytype : 2）,续费（buytype : 2））
  try {
    console.log(wx.getStorageSync('loginUserinfo').userid, 'usdfsid');
    let data = {
      user_id: wx.getStorageSync('loginUserinfo').userid,
      buytype,
    }
    if (Object.keys(otherParam).length >= 3) {
      data = Object.assign(data, otherParam)
    }

    console.log('hideloading');
    const res = await createVipOrderReq(data)
    console.log(res, 'res createVipOrderReq');
    wx.hideLoading()
    if (res.data.code == 1) {
      // 获取orderid， 跳转页面 订单详情页面
      // app.gopath('/pages/orderDetail/orderDetail?id=' + res.data.data.order_id)
      return await payMoney(res.data.data.order_id)

    } else if (res.data.code === 2) {
      return Promise.resolve({ errMsg: res.data.msg, code: 2 })
    } else {
      console.log(res.data.msg);
      return Promise.resolve({ errMsg: '生成订单失败', toastmsg: res.data.msg, code: 999 })
    }
  } catch (error) {
    wx.hideLoading()
    return Promise.resolve({ errMsg: '生成订单失败 error', toastmsg: res.data.msg, code: 999 })
  }
}

export const payMoney = async (order_id) => {
  return new Promise(async (resolve, rejcet) => {
    const co_data = await getOpenidAndCode()
    if (co_data.code !== 1) {
      return app.toast(co_data.msg)
    }
    const res = await evokePaymentReq(Object.assign({
      order_id,
      user_id: wx.getStorageSync('loginUserinfo').userid,
    }, co_data.data))
    console.log(res, 'res payMoney');
    if (res.data.code === 1) {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success: res => {
          console.log(res, 'success');
          app.updateUserStorage()
          // wx.setStorageSync('loginUserinfo', userinfoLogin)
          resolve({ errMsg: res.errMsg, code: 1 })
        },
        fail: res => {
          console.log(res, 'fail');
          resolve({ errMsg: res, code: 999 })
        },
        complete: res => {
          console.log(res, 'complete');
          resolve({ errMsg: res, code: 999 })
        }
      })
    }

  })
}

async function getOpenidAndCode() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await app.wxLogin()
      console.log(res, 'res');
      // const res2 = await getDxtOpenidReq({ code: res.code })
      // console.log(res2, 'res2');
      let data = {
        // from: 'dxt',
        // openid: JSON.parse(res2.data.data).openid
      }
      resolve({ code: 1, msg: '请求成功', data })
    } catch (error) {
      resolve({ code: 999, msg: '请求失败 未获得openid', data })
    }
  })
}