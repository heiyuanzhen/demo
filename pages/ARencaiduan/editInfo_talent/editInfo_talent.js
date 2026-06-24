const { Addpost, uploadgai } = require('../../../utils/index')
const { userEditResumeReq, getLineResume } = require('../../../utils/api/reqTalent')
let addpost = new Addpost()
const app = getApp().rencaiApp

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: {
      thumb: { isRequire: true, toast: '请选择头像', placeholder: '请选择'},    // 头像
      truename: { isRequire: true, toast: '请填入真实姓名', placeholder: '请填入',  }, // 真实姓名
//      height: { isRequire: false, toast: '请填入身高', placeholder: '请填入',  }, // 身高
//      weight: { isRequire: false, toast: '请填入体重', placeholder: '请填入',  }, // 体重
//      school: { isRequire: false, toast: '请填入毕业院校', placeholder: '请填入',  }, // 毕业院校
//      major: { isRequire: false, toast: '请填入所学专业', placeholder: '请填入',  }, // 所学专业
      skill: { isRequire: true, toast: '请填入专业技能', placeholder: '请填入',  }, // 专业技能
//      language: { isRequire: false, toast: '请选择语言水平', placeholder: '请选择',  }, // 语言水平
      experience: { isRequire: true, toast: '请选择工作经验', placeholder: '请选择',  }, // 工作经验
//      idcard: { isRequire: false, toast: '请填入身份证号', placeholder: '请填入',  }, // 身份证号
      mobile: { isRequire: true, toast: '请填入联系手机', placeholder: '请填入',  }, // 联系手机
      email: { isRequire: true, toast: '请填入电子邮件', placeholder: '请填入',  }, // 电子邮件
//      telephone: { isRequire: false, toast: '请填入联系电话', placeholder: '请填入',  }, // 联系电话
      addresss: { isRequire: false, toast: '请填入联系地址', placeholder: '请填入',  }, // 联系地址
      catid: { isRequire: true, toast: '请选择岗位类别', placeholder: '请选择',  }, // 岗位类别
      gender: { isRequire: true, toast: '请选择性别', placeholder: '请选择',  }, // 性别
      type: { isRequire: false, toast: '请选择工作性质', placeholder: '请选择',  }, // 工作性质
      education: { isRequire: true, toast: '请选择学历', placeholder: '请选择',  }, // 学历
      situation: { isRequire: true, toast: '请选择求职状态', placeholder: '请选择',  }, // 求职状态
      address: { isRequire: false, toast: '请选择地址', placeholder: '请选择',  },  // 地址
      birthday: { isRequire: false, toast: '请填入生日', placeholder: '请填入',  }, // 生日
      worklist: { isRequire: true, toast: '请填入工作经历', placeholder: '请填入',  }, // 工作经历
      stulist: { isRequire: false, toast: '请填入学习经历', placeholder: '请填入',  },  // 学习经历
      introduce: { isRequire: false, toast: '请填入自我鉴定', placeholder: '请填入',  },  // 自我鉴定
      marriage: { isRequire: false, toast: '请选择婚姻状况', placeholder: '请选择',  }, // 婚姻状况
      minsalary: { isRequire: false, toast: '请选择最低薪资', placeholder: '请选择',  }, // 最低薪资
      maxsalary: { isRequire: false, toast: '请选择最高薪资', placeholder: '请选择',  }, // 最高薪资
      // addresss: { isRequire: false, placeholder: '请填入联系地址',  }, // 联系地址
    },
    formdata: {
      truename: '',
//      height: '',
//      weight: '',
//      school: '',
//      major: '',
      skill: '',
//      language: '',
      experience: '',
//      idcard: '',
      mobile: '',
      email: '',
//      telephone: '',
      // addresss: '',
      catid: '',
      gender: 0,
      type: 0,
      education: '',
      situation: '',
      thumb: '',
      address: '',
      birthday: '',
      worklist: '',
      stulist: '',
      introduce: '',
      marriage: '',
      minsalary: '',
      maxsalary: '',

    },
    jobdetail: {
      // catname: '营销类',
      // truename: '左xx',
      // height: '170',
      // weight: '130',
      // school: '清华大学',
      // major: '软件开发',
      // skill: 'Vue React Redux',
      // language: 'C语言 Javascript',
      // experience: '19',
      // idcard: '362228199908113112',
      // mobile: '13579659799',
      // email: '1249434465@qq.com',
      // telephone: '124944545',
      // catid: '77',
      // gender: '1',
      // type: '1',
      // education: '4',
      // situation: '1',
      // thumb: 'https://cdn1.chinayarn.com/dsc/2020-09/img/i4r0qphp2X8QqU1601449523200930.png',
      // address: '北京市,北京市,海淀区',
      // birthday: '1999-08-11',
      // worklist: '自从我第一次进入电子厂，已有10年之久，我时常想起那个午后，点起一根烟将整个厂子烧毁的场景。',
      // stulist: '学习如何成为Rapper Star。',
      // introduce: '学习成为Rapper star 的第一步，您需要这本Javascript高级编程@!',
      // marriage: '1',
      // minsalary: '10000',
      // maxsalary: '20000',
      // addresss: '浙江省杭州奥豪斯',
    },
    lookmoreText: '查看更多',
    isshowBottom: false,

    resultImage: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    await this.getEdituserinfo()
    this.handleStorageData()
  },
  onShow(){
    if (this.data.resultImage !== '') {
      this.setData({
        ['formdata.thumb']: this.data.resultImage
      })
    }
  },

  async getEdituserinfo(){
    const res = await getLineResume({
      userid: wx.getStorageSync('loginUserinfo').userid
    })
    if (res.data.code === 1) {
      wx.setStorageSync('edit_userinfo', res.data.data)
    }
  },

  async handleStorageData(){
    console.log(addpost.isStorage());
    this.setData({
      postselectData: addpost.isStorage() ? addpost.get() : await addpost.getData()
    })
    let obj = wx.getStorageSync('edit_userinfo') || {}
    let loginuser = wx.getStorageSync('loginUserinfo') || {}
    console.log(obj, 'obj');
    let thumb
    try {
      thumb = obj.thumb || loginuser.avatarUrl
    } catch (error) {
      thumb = ''
    }
    let data = {
      truename: obj.truename,
//      height: obj.height,
//      weight: obj.weight,
//      school: obj.school,
//      major: obj.major,
      skill: obj.skill,
//      language: obj.language,
      experience: obj.experience,
//      idcard: obj.idcard,
      mobile: obj.mobile,
      email: obj.email,
//      telephone: obj.telephone,
      catid: obj.catid,
      gender: obj.gender,
      type: obj.type,
      education: obj.education,
      situation: obj.situation,
      thumb: thumb,
      address: obj.address,
      birthday: obj.birthday,
      worklist: obj.worklist,
      stulist: obj.stulist,
      introduce: obj.introduce,
      marriage: obj.marriage,
      minsalary: obj.minsalary,
      maxsalary: obj.maxsalary,
      catname: obj.catname, // 回显需要用到的值，但是编辑的时候不需要发送给后台
    }

    this.setData({
      formdata: data,
      jobdetail: data,
    })
  },

  textInputChange(e){
    const value = e.detail.detail.value
    const key = e.detail.target.dataset.key
    this.setFormData(key, value)
  },

  setFormData(key, val) {
    this.setData({
      [`formdata.${key}`]: val
    })
  },

  threeLevelPickerChange(e) {
    console.log(e.detail, 'eee');

    this.setFormData('catid', e.detail)
  },


  twolevelPickerChange(e) {
    console.log(e, 'detail');
    const value = e.detail.detail.value
    const key = e.detail.target.dataset.key
    this.setFormData(key, value)
  },

  //上传头像
  uploadAvatar: function () {

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: `/pages/uploadAvatar/uploadAvatar?src=${src}`
        })
      }
    })

  },

  

  addresschange(e) {
    let address = e.detail.join(',')
    this.setFormData('address', address)
  },

  birthdayChange(e){
    console.log(e.detail, 'ee');
    this.setFormData('birthday', e.detail.detail.value)
  },

  editSalaryInputChange(e){
    console.log(e, 'eee');
    const key = e.detail.currentTarget.dataset.key
    const value = e.detail.detail.value
    this.setFormData(key, value)

  },

  editorChange(e){
    const key = e.detail.currentTarget.dataset.key
    const value = e.detail.detail.detail.html
    this.setFormData(key, value)
  },
  async saveMessage(){
    let formdata = this.data.formdata
    let rules = this.data.rules
    delete formdata['catname']
    for(let key in formdata){
      let item = formdata[key]
      // console.log(item, key, 'item kety');

      if (!item && rules[key].isRequire) {
        console.log(item, key, 'item kety');
        if (item !== 0 && item !== '0') {
          return wx.showModal({
            title: "提示",
            content: `${rules[key].toast}`,
            confirmColor: "#26BA8D",
            confirmText: "确定",
            cancelText: "取消",
            cancelColor: "#000"
          })
        }
      }
    }

    console.log(formdata, 'data');
    let itemid = wx.getStorageSync('edit_userinfo').itemid
    formdata.itemid = itemid
    this.setData({
      itemid
    })

    const res = await userEditResumeReq(formdata)
    if (res.data.code === 1){
      const res = await getLineResume({userid: wx.getStorageSync('loginUserinfo').userid})
      if (res.data.code === 1) {
        wx.setStorageSync('edit_userinfo', res.data.data)
      }
      wx.showModal({
        title: "提示",
        content: "在线简历编辑成功!",
        confirmColor: "#26BA8D",
        confirmText: "去查看",
        cancelText: "取消",
        cancelColor: "#000",
        success: (res) => {
          if (res.confirm) {
            app.gopath('/pages/AQiyeduan/talentDetail/talentDetail?id=' + this.data.itemid + '&type=1')
          }
        },
      })
      
    }else{
      console.log(res.data); 
      return wx.showModal({
        title: "提示",
        content: res.data.msg,
        confirmColor: "#26BA8D",
        confirmText: "确定",
        cancelText: "取消",
        cancelColor: "#000"
      })
    }
  },

  toggleHiddenShow(){
    this.setData({
      isshowBottom: !this.data.isshowBottom,
    })
    this.setData({
      lookmoreText: !this.data.isshowBottom ? '查看更多' : '收起'
    })
  },

  onPullDownRefresh: async function () {
    console.log('onPullDownRefresh');
    addpost.clear()
    await addpost.getData()
    await this.handleStorageData()
    wx.stopPullDownRefresh()

  },

  textareaChange(e){
    const key = e.detail.currentTarget.dataset.key
    const value = e.detail.detail.value
    this.setFormData(key, value)
  }


})