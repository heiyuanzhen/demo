const { config } = require('../../../utils/wxRequest')
const { getJobDetailReq, collectionJobReq, contactJobReq, toudiReq, resumeFilelistReq, getRcCode } = require("../../../utils/api/reqTalent")
const { PayForVip } = require('../../../utils/pay')

const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobDetail: {
      itemid: '111'
    },
    selectResumeShow: false,
    resumes: [],
    iscansend: false,

    showList: [
      { index: 0, isAll: false },
      { index: 1, isAll: false },
    ],
    bigimg: false,
    canvasWidth: 604,
    canvasHeight: 803,
    width: wx.getSystemInfoSync().windowWidth,
    height: wx.getSystemInfoSync().windowHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    this.setData({
      job_id: options.id,
      loginUserinfo: wx.getStorageSync('loginUserinfo') || {},
      isboss: wx.getStorageSync('isBoss') || '2'
    })
    await this.getjobDetail()
    await this.getresumes()
  },
  // 统一异步获取图片信息方法
  getPromiseImg(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: resolve,
        fail: reject
      })
    })
  },
  // 获取二维码
  getQrcode() {
    var _this = this
    return new Promise(async (resolve, reject) => {
      var res = await getRcCode({ path: '/pages/ARencaiduan/postItemDetail/postItemDetail', id: _this.data.job_id })
      console.log(res, "二维码图片")
      wx.getImageInfo({
        src: res.data.ret.url,
        success: resolve,
        fail: reject
      })
    })
  },
  closePoster() {
    this.setData({
      bigimg: false
    })
  },

  //打开海报
  openShare() {
    wx.showLoading({
      title: '生成海报中'
    })
    this.drawReportPoster();
  },
  drawReportPoster() {
    var x = this.data, width = x.width, _this = this
    var msg = this.data.jobDetail
    console.log(msg, "海报信息详情")
    const cvs = wx.createCanvasContext('cvs')
    const getPosterBg = this.getPromiseImg('https://cdn1.chinayarn.com/dsc/2024-01/img/YOOJUphpKdRmQI1705989261240123.png')
    const getQrcode = this.getQrcode()
    Promise.all([getPosterBg, getQrcode]).then(([posterBg, qrcode]) => {
      console.log(qrcode, "???erweima ")
      cvs.fillRect(0, 0, x.canvasWidth, x.canvasHeight);
      cvs.drawImage(posterBg.path, 0, 0, x.canvasWidth, x.canvasHeight) // 大背景
      cvs.setFontSize(34) //字体大小
      cvs.setFillStyle('#fff') //字体颜色
      var test = msg.company.split("")
      var temps = "";
      var rowstext = [];
      for (var a = 0; a < test.length; a++) {
        if (cvs.measureText(temps).width < 450) {
          temps += test[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          rowstext.push(temps);
          temps = "";
        }
      }
      rowstext.push(temps);
      if (cvs.measureText(msg.company).width < 480) {
        cvs.fillText(msg.company, 60, 70)
      } else {
        cvs.fillText(rowstext[0] + '...', 60, 70)
      }
      cvs.save()
      cvs.restore()
      // cvs.fillText(msg.introduce_text, 60, 140)
      cvs.fillStyle = "#FFFFFF";
      var chr = msg.company_introduce_text.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      cvs.font = '24px sans-serif'
      for (var a = 0; a < chr.length; a++) {
        if (cvs.measureText(temp).width < 490) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      //如果数组长度大于3 则截取前两个
      if (row.length > 3) {
        var rowCut = row.slice(0, 3);
        var rowPart = rowCut[2];
        console.log(rowCut[2], "11")
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (cvs.measureText(test).width < 490) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        empty.push(test);

        var group = empty[0] + '....'  //这里只显示三行，超出的用...表示
        rowCut.splice(2, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        if (b == 0) {
          cvs.fillText(row[b], 45, 120 + b * 35,);
        } else {
          cvs.fillText(row[b], 45, 120 + b * 35,);
        }
      }
      cvs.restore()
      cvs.setFontSize(26) //字体大小
      cvs.setFillStyle('#000') //字体颜色
      cvs.fillText(msg.title, 60, 320)
      cvs.save()
      cvs.setFontSize(22) //字体大小
      cvs.setFillStyle('#000') //字体颜色
      cvs.save()
      cvs.beginPath();
      //矩形边框
      cvs.lineWidth = 13
      //矩形变宽颜色
      cvs.strokeStyle = "#26BA8D";
      //x,y,宽度,高度
      cvs.rect(65, 345, 1, 15)
      cvs.stroke();
      cvs.fillText('岗位要求', 90, 360)
      cvs.restore()
      var catid = msg.catid ? '岗位类别：' + msg.catid : ''
      var education = msg.education ? '学历：' + msg.education : ''
      var experience = msg.experience ? (msg.experience == '0年' ? '经验不限' : '工作经验：' + msg.experience) : ''
      var gender = msg.gender ? '性别：' + msg.gender : ''
      var age = msg.age ? '年龄：' + msg.age : ''
      var address = msg.address ? '工作地址：' + msg.address : ''
      var xinzi = msg.xinzi ? '薪资：' + msg.xinzi : ''
      var text = catid + ' ' + education + ' ' + experience + ' ' + gender + ' ' + age + ' ' + address + ' ' + xinzi
      var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      cvs.font = '22px sans-serif'
      cvs.setFillStyle('#8D8E90') //字体颜色
      for (var a = 0; a < chr.length; a++) {
        if (cvs.measureText(temp).width < 390) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      //如果数组长度大于3 则截取前两个
      if (row.length > 3) {
        var rowCut = row.slice(0, 3);
        var rowPart = rowCut[2];
        console.log(rowCut[2], "11")
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (cvs.measureText(test).width < 390) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        empty.push(test);
        console.log(empty, "???")
        var group = empty[0] + '....'  //这里只显示三行，超出的用...表示
        rowCut.splice(2, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        if (b == 0) {
          cvs.fillText(row[b], 50, 400 + b * 35,);
        } else {
          cvs.fillText(row[b], 50, 400 + b * 35,);
        }
      }
      cvs.save()
      cvs.beginPath();
      //矩形边框
      cvs.lineWidth = 13
      //矩形变宽颜色
      cvs.strokeStyle = "#26BA8D";
      //x,y,宽度,高度
      cvs.rect(65, 505, 1, 15)
      cvs.stroke();
      cvs.setFontSize(22) //字体大小
      cvs.setFillStyle('#000') //字体颜色
      cvs.fillText('岗位描述', 90, 520)
      cvs.restore()
      var chr = msg.introduce_text.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      cvs.font = '22px sans-serif'
      cvs.setFillStyle('#8D8E90') //字体颜色
      for (var a = 0; a < chr.length; a++) {
        if (cvs.measureText(temp).width < 390) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      //如果数组长度大于3 则截取前两个
      if (row.length > 3) {
        var rowCut = row.slice(0, 3);
        var rowPart = rowCut[2];
        console.log(rowCut[2], "11")
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (cvs.measureText(test).width < 390) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        empty.push(test);
        console.log(empty, "???")
        var group = empty[0] + '....'  //这里只显示三行，超出的用...表示
        rowCut.splice(2, 1, group);
        row = rowCut;
      }
      for (var b = 0; b < row.length; b++) {
        if (b == 0) {
          cvs.fillText(row[b], 55, 560 + b * 35,);
        } else {
          cvs.fillText(row[b], 55, 560 + b * 35,);
        }
      }
      cvs.save()
      cvs.drawImage(qrcode.path, 30, 710, 80, 80) // 二维码
      cvs.restore()
      cvs.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'cvs',
          success(res) {
            wx.hideLoading()
            _this.setData({
              imagePath: res.tempFilePath,
              bigimg: true,
            })
          }
        })
      })
    }).catch(err => {
      app.toast('生成失败' + JSON.stringify(err))
    })
  },
  saveCard(e) {
    var that = this
    wx.showLoading()
    wx.canvasToTempFilePath({
      canvasId: 'cvs',
      success: function (res) {
        console.log(res, "????")
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.hideLoading()
            app.toast('保存成功');
            that.setData({
              bigimg: false
            })

          },
          fail: function () {

            app.toast('保存失败，请查看设置 --> 相册,是否打开');
          }
        })
      }
    });
  },

  async getjobDetail() {
    const res = await getJobDetailReq({
      job_id: this.data.job_id,
      user_id: this.data.loginUserinfo.userid || ''
    })
    if (res.data.code === 1) {
      let obj = res.data.data
      // console.log(obj.title)
      // console.log(config, 'config');
      // console.log(obj.type, "999");


      obj.type = config.gzxz[obj.type].name
      obj.marriage = config.hyzk[obj.marriage].name

      let jobDetail = res.data.data

      jobDetail.companyintroduce = app.matchStr(jobDetail.companyintroduce)
      jobDetail.introduce = app.matchStr(jobDetail.introduce)
      jobDetail.companyintroduceLength = app.matchStr(jobDetail.companyintroduce, 2)
      jobDetail.introduceLength = app.matchStr(jobDetail.introduce, 2)

      this.setData({
        jobDetail
      })
    }

  },

  async clickIconTap() {
    const res = await collectionJobReq({
      job_id: this.data.job_id,
      user_id: this.data.loginUserinfo.userid
    })
    if (res.data.code === 1) {
      this.getjobDetail()
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

  onShareAppMessage: function () {
    return {
      title: '邀您查看岗位详情~',
      path: '/pages/ARencaiduan/postItemDetail/postItemDetail?id=' + this.data.job_id
    }
  },

  sendMessage(e) {
    // 判断是否登录
    let isLogin = app.isLoginInApp()
    if (!isLogin) {
      return app.gopath('/pages/phoneLogin/phoneLogin')
    }

    // if (this.data.loginUserinfo && this.data.loginUserinfo.isVip == 1) {
    // 联系他

    const { phone } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone,
      success: async res => {
        // console.log(res, 'res');
        let data = {
          user_id: this.data.loginUserinfo.userid,
          job_id: this.data.job_id
        }
        const resp = await contactJobReq(data)
        // console.log(resp, 'resp');
      },
      fail: err => {
        // 取消
        console.log(err, 'err');
      }
    })

    // }else{
    //   this.toggleDialogShow()
    // }

  },

  toggleDialogShow() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },

  // 生成订单详情
  async getOrderDetail() {
    const res = await PayForVip()
    // console.log(res, 'PayForVip');
    if (res.errMsg = "requestPayment:ok" && (res && res.code !== 999)) {
      // console.log(res, 'res');
      // 处理支付成功之后的逻辑
      let loginUserinfo = wx.getStorageSync('loginUserinfo')
      this.setData({
        loginUserinfo
      })
      app.toast('尊敬的用户，恭喜您成功开通会员!')

    } else if (res.code === 999) {
      app.toast('支付失败')
    } else {
      console.log(res, 'res 134 postitemDetail');
    }
  },

  async sendresume() {
    if (!this.data.iscansend) {
      return
    }
    let item = this.data.resumes.find(e => e.isOn)
    // console.log(item, 'item');
    let data = {
      userid: this.data.loginUserinfo.userid,
      jobid: this.data.job_id,
      fileid: item.id
    }
    const res = await toudiReq(data)
    if (res.data.code === 1) {
      wx.showModal({
        title: "提示",
        content: "投递成功!请等待企业回复~",
        confirmColor: "#26BA8D",
        cancelColor: "#000"
      })
      this.sendresumeShow()
    } else if (res.data.code === 0) {
      wx.showModal({
        title: "提示",
        content: "投递失败!请先联系企业~",
        confirmColor: "#26BA8D",
        cancelColor: "#000"
      })
    } else {
      wx.showModal({
        title: "提示",
        content: res.data.msg,
        confirmColor: "#26BA8D"
      })
    }
  },

  async sendresumeShow() {
    if (!this.data.resumes || this.data.resumes.length <= 0) {
      wx.showModal({
        title: "提示",
        content: "您当前还没有上传简历~",
        confirmColor: "#26BA8D",
        confirmText: "去上传",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            app.gopath('/pages/ARencaiduan/resumeAttachment/resumeAttachment')
          }
        },
      })
      return
    }
    this.setData({
      selectResumeShow: !this.data.selectResumeShow
    })
  },

  async getresumes() {
    const res = await resumeFilelistReq({
      userid: this.data.loginUserinfo.userid
    })
    let list = res.data.data
    list.forEach(item => {
      let type = 'other'
      if (/\.pdf/.test(item.file_name)) {
        type = 'pdf'
      } else if (/\.docx/.test(item.file_name)) {
        type = 'word'
      }
      item.type = type
    })
    this.setData({
      resumes: list
      // resumes: []
    })
  },

  clickCheckIcon(e) {
    const { id } = e.currentTarget.dataset
    let resumes = this.data.resumes
    resumes.forEach(item => {
      if (item.id == id) {
        item.isOn = !item.isOn
      } else {
        item.isOn = false
      }
      if (item.isOn) {
        this.setData({
          iscansend: true
        })
      } else {
        this.setData({
          iscansend: false
        })
      }
    });
    this.setData({
      resumes
    })
  },

  catchtap() {
    return
  },

  toggleShoAll(e) {
    const { index } = e.currentTarget.dataset
    let list = this.data.showList
    list[index].isAll = !list[index].isAll
    // console.log(list, 'list');

    this.setData({
      showList: list
    })
  }

})