const {
  jobLabelSelectReq
} = require("../../utils/api/index");
const {
  Query
} = require('../../utils/index')
const {
  Addpost
} = require('../../utils/index')
let addpost = new Addpost()
const query = new Query()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryList: [],

    address: '',
    postselectData: '',
    catid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    const res = await jobLabelSelectReq()
    try {
      this.setData({
        queryList: res.data.data || []
      })
    } catch (error) {
      this.setData({
        queryList: []
      })
    }
    await this.getPostSelectData()

  },
  async getPostSelectData() {
    let postselectData = {}
    if (addpost.isStorage()) {
      postselectData = addpost.get()
    } else {
      postselectData = await addpost.getData()
    }
    this.setData({
      postselectData
    })
  },
  threeLevelPickerChange(e) {
    console.log(e.detail,"什么？")
    this.setData({
      catid: e.detail
    })
  },

  queryitemChange(e) {
    const {
      index
    } = e.currentTarget.dataset
    let childlist = e.detail.childlist
    let queryList = this.data.queryList
    // console.log(index, 'index', queryList, 'queryList');
    queryList[index].childlist = childlist
    this.setData({
      queryList
    })

  },

  clearAll() {
    query.clear()
  },

  confirmSel() {
    let queryList = this.data.queryList
    let ids = ''
    queryList.forEach(queryItem => {
      let item = queryItem.childlist.find(e => e.isOn)
      if (item) {
        // console.log(item, 'item');
        ids += `,${item.id}`
      }
    });
    
    query.set({
      seachids: ids || '',
      address: this.data.address || '',
      catid: this.data.catid || ''
    })

    wx.navigateBack()
  },

  addresschange(e) {
    // console.log(e.detail);
    let address = e.detail.length > 0 ? e.detail.join(',') : ''
    this.setData({
      address
    })
  }
})