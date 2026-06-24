// components/queryItem/queryItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    queryItem: {
      type: Object,
      default: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached: function () {
      console.log(this.data.queryItem);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickItem(e){
      let { id } = e.currentTarget.dataset
      let queryItem = this.data.queryItem
      // let item = queryItem.childlist.find(e => e.id == id)
      queryItem.childlist.forEach(item => {
        if (item.id == id) {
          item.isOn = !item.isOn
        }else{
          item.isOn = false
        }
      });
      this.setData({
        queryItem
      })
      this.triggerEvent('queryitemChange', queryItem)
    }
  }
})
