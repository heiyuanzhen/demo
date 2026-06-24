const { getRegionReq } = require("../../utils/api/index");
const { Query } = require("../../utils/index");

// pages/selectCity/selectCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityListOne: [],
    cityListTwo: [],
    cityListThree: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOneList()
  },
  async getOneList(){
    let resp = await getRegionReq()
    console.log(resp, 'resp');
    this.setData({
      cityListOne: resp.data.data
    })
  },

  async cityoneChange(e){
    const { id, ison } = e.currentTarget.dataset
    if(ison){
      return
    }
    // 将第一个变颜色
    let cityListOne = this.data.cityListOne
    cityListOne.forEach(item => {
      if (item.id == id) {
        item.isOn = true
      }else{
        item.isOn = false
      }
    });
    
    if (id === 0) {
      this.setData({
        cityListOne,
        cityListTwo: [],
        cityListThree: []
      })
      return
    }

    const resp = await getRegionReq({id})
    console.log(resp, 'resp');
    this.setData({
      cityListTwo: resp.data.data,
      cityListOne,
      cityListThree: []
    })
    
  },

  async citytwoChange(e){
    const { id, ison } = e.currentTarget.dataset
    if(ison){
      return
    }
    // 将第二个变颜色
    let cityListTwo = this.data.cityListTwo
    cityListTwo.forEach(item => {
      if (item.id == id) {
        item.isOn = true
      }else{
        item.isOn = false
      }
    });
    const resp = await getRegionReq({id})
    console.log(resp, 'resp');
    this.setData({
      cityListThree: resp.data.data,
      cityListTwo
    })
  },

  citythreeChange(e){
    const { id, ison } = e.currentTarget.dataset
    if(ison){
      return
    }
    let cityListThree = this.data.cityListThree
    cityListThree.forEach(item => {
      if (item.id == id) {
        item.isOn = true
      }else{
        item.isOn = false
      }
    });
    this.setData({
      cityListThree
    })
  },

  gobackNavigate(id){
    let q = new Query()
    q.set({cityid: id})
    wx.navigateBack()

  },

  gobackindexWithQuery(){
    let cityThree = this.data.cityListThree
    let itemThree = cityThree.find(e => e.isOn)
    if (itemThree) {
      // 这里的id就是筛选条件需要加的id
      console.log(itemThree.id, 'itemThree.id');
      this.gobackNavigate(itemThree.id)
    }else{
      let cityTwo = this.data.cityListTwo
      let itemTwo = cityTwo.find(e => e.isOn)
      if (itemTwo) {
        // 这里的id就是筛选条件需要加的id
        console.log(itemTwo.id, 'itemTwo');
        this.gobackNavigate(itemTwo.id)
      }else{
        let cityOne = this.data.cityListOne
        let itemOne = cityOne.find(e => e.isOn)
        if (itemOne) {
          console.log(itemOne.id, 'itemTwo');
          this.gobackNavigate(itemOne.id)
        }else{
          console.log('没有选择任何条件');
          
        }
      }
    }
    
  }
  
})