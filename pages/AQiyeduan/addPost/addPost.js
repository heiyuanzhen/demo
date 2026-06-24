import { addPostDataReq, getJobDetailReq } from '../../../utils/api/reqTalent'
import { Addpost } from '../../../utils/index'

let addpost = new Addpost()
const app = getApp().rencaiApp

Page({
  /**
   * 页面的初始数据
   */
  data: {
    postselectData: {},
    formdata: {
      address: '',
      catid: '',
      education: '',
      experience: '',
      gender: '',
      gzxz: '',
      hyzk: '',
      introduce: '',
      nl: '',
      title: '',
      total: '',
      xinzi: '',
      lxr: '',
      lxdh: '',
      user_id: '',
    },
    keyItems: {
      address: { placeholder: "请输入地址", isRequire: true },
      catid: { placeholder: '请选择岗位类别', isRequire: true },
      education: { placeholder: '请选择学历', isRequire: true },
      experience: { placeholder: '请选择工作经验', isRequire: false },
      gender: { placeholder: '请选择性别', isRequire: false },
      gzxz: { placeholder: '请选择工作性质', isRequire: false },
      hyzk: { placeholder: '请选择婚姻状况', isRequire: false },
      introduce: { placeholder: '请输入岗位描述', isRequire: true },
      nl: { placeholder: '请选择年龄', isRequire: false },
      title: { placeholder: '请输入岗位名', isRequire: true },
      total: { placeholder: '请输入招聘人数', isRequire: true },
      xinzi: { placeholder: '请选择工作性质', isRequire: true },
      lxr: { placeholder: '请输入联系人姓名', isRequire: true },
      lxdh: { placeholder: '请输入联系电话', isRequire: true },
      user_id: { placeholder: '请传入userid', isRequire: true },
    },
    jobdetail: {},
    loginUserinfo: {},
    isEdit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (options.id) {
      this.setData({
        job_id: options.id,
        isEdit: true
      })
      await this.getJobDetailWithId()
    }else{
    //没有职位信息时清除editor存入的其他数据缓存
    wx.removeStorageSync('editorText')
    }

    this.getStorageUserinfo()

    await this.getPostSelectData()
  },
  async getJobDetailWithId() {
    // 处理回显逻辑
    const res = await getJobDetailReq({ job_id: this.data.job_id })
    let d = res.data.data
    console.log(d,"文档数据")
    //缓存可能会覆盖其他修改信息，在进行存储
    wx.setStorageSync('editorText', d.introduce)
    
    if (res.data.data.editform) {
      let jobdetail = JSON.parse(res.data.data.editform)
      this.setData({
        formdata: jobdetail,
        ['formdata.catname']: d.catid
      })
    }else{
      // PC的字段 需要部分回显
      this.setData({
        ['formdata.lxr']: d.truename,
        ['formdata.lxdh']: d.mobile,
        ['formdata.title']: d.title,
        ['formdata.total']: d.total,
        ['formdata.introduce']: d.introduce,
      })
    }

    // 根据id获得jobdetail 并且处理之后 应该是data的数据
    // this.setData({
    //   formdata: {
    //     address: '浙江省,杭州市,不限',
    //     catid: '77',
    //     education: '8',
    //     experience: '21',
    //     gender: '1',
    //     gzxz: '1',
    //     hyzk: '1',
    //     introduce: '这是一个前端岗位，需要会使用React Mongoose Vue Redux等',
    //     nl: '0,20',
    //     title: '前端工程师',
    //     total: '10',
    //     xinzi: '13',
    //     lxr: '左俊宇',
    //     lxdh: '13576599725',
    //     user_id: '232173',
    //     catname: '营销类'
    //   },
    //   isEdit: true
    // })
    
    wx.setNavigationBarTitle({
      title: '修改招聘岗位信息',
    })
  },


  getStorageUserinfo() {
    let obj = wx.getStorageSync('loginUserinfo') || {}
    if (!obj.userid) {
      return wx.showModal({
        title: "提示",
        content: "请登录来获得最佳体验",
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
        showCancel: false,
        success: (res) => {
          app.gopath('/pages/phoneLogin/phoneLogin', 2)
        },
      })
    }
    this.setData({
      loginUserinfo: obj,
      ['formdata.lxr']: obj.truename || '',
      ['formdata.lxdh']: obj.mobile || '',
      ['formdata.user_id']: obj.userid || '',
    })

  },


  async getPostSelectData() {
    let postselectData = {}
    if (addpost.isStorage()) {
      postselectData = addpost.get()
    } else {
      postselectData = await addpost.getData()
    }
    this.setData({
      postselectData: postselectData
    })
  },

  threeLevelPickerChange(e) {
    console.log(e.detail, 'eee');

    this.setFormData('catid', e.detail)
  },

  setFormData(key, val) {
    this.setData({
      [`formdata.${key}`]: val
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    console.log('onPullDownRefresh');
    addpost.clear()
    await this.getPostSelectData()
    wx.stopPullDownRefresh()

  },

  InputChange(e) {
    const value = e.detail.detail.value
    const key = e.detail.target.dataset.key
    this.setFormData(key, value)
  },

  twolevelPickerChange(e) {
    console.log(e, 'detail');
    const value = e.detail.detail.value
    const key = e.detail.target.dataset.key
    this.setFormData(key, value)

  },

  addresschange(e) {
    let address = e.detail.join(',')
    this.setFormData('address', address)
  },

  async addPostClick() {
    console.log(this.data.formdata, '岗位总信息');
    var html=wx.getStorageSync('editorText')
    console.log(html,"缓存editor信息")

     this.setFormData('introduce', html)
    // console.log(this.data.formdata,"发布或修改岗位信息");
    console.log(this.data.keyItems);
    let formdata = this.data.formdata
    let keyItems = this.data.keyItems
    let keys = Object.keys(this.data.formdata)

    let key = keys.find(key => ((formdata[key] == '') && keyItems[key].isRequire))
    console.log(key);

    if (this.data.formdata.nl == '') {
      this.setData({
        'formdata.nl': '0,0'
      })
    }

    if (key) {
      return wx.showModal({
        title: "提示",
        content: keyItems[key].placeholder,
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000",
      })
    }
    //从缓存获取信息赋值
    this.data.formdata.introduce=html
    let data = this.data.formdata
    if (this.data.isEdit) {
      data.itemid = this.data.job_id
    }
    const res = await addPostDataReq(data)
    if (res.data.code === 1) {
      wx.showModal({
        title: `${this.data.isEdit ? '编辑' : '添加'}成功!`,
        content: "去查看~",
        confirmColor: "#26BA8D",
        success: (res1) => {
          if (res1.confirm) {
            app.gopath('/pages/AQiyeduan/recruitments/recruitments')
          }
        },
      })

    } else {
      app.toast(res.data.msg)
    }
    //清除editor存入的缓存
    // wx.removeStorageSync('editorText')
  },

  // editorChange(e){
  // //   console.log(e.detail, 'ee内容内容内容11111111111111???????');

  // //   const key = e.detail.currentTarget.dataset.key
  // //   const value = e.detail.detail.detail.html
  // //   // this.setFormData(key, value)
  // //   var html=wx.getStorageSync('editorText')
  // //    console.log(html,"缓存editor信息")
  // },


})