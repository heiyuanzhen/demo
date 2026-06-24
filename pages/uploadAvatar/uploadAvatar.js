import WeCropper from '../we-cropper/we-cropper.js'
const util = require('../../utils/upload')

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    console.log("点击了确定")
    this.wecropper.getCropperImage(async (avatar) => {
      console.log("获取到的图片", avatar);
      if (avatar) {
        console.log("上传中");
        const res = await util.uploadgai({
          file: avatar
        })
        console.log(res, 'res');
        if (res.code == 200) {
          // console.log("上传成功", ret)
          var pages = getCurrentPages();
          var that = pages[pages.length - 2]
          if (this.data.type == 1) {
          //营业执照裁切
            that.setData({
              resultImg: res.ret
            })
          } else {
          //公司logo裁切
            that.setData({
              resultImage: res.ret
            })
          }


          wx.navigateBack({
            delta: 1
          })
        }
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const {
      cropperOpt
    } = this.data
    //上传营业执照的传参
    this.setData({
      type: option.type
    })
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})