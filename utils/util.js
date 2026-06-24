const { config } = require('./wxRequest')
const { formSelectDataReq } = require('../api/reqTalent')
const uploadutils = require('./upload')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



// 这是条件筛选的类
class Query {
  constructor() {
    // 设置筛选条件失效时间
    setTimeout(() => {
      this.clear()
    }, 5 * 1000);


  }

  get() {
    return wx.getStorageSync('_queryString') || {}
  }

  set(val) {
    let lastQuery = wx.getStorageSync('_queryString') || {}
    let newQuery = Object.assign(lastQuery, val)
    wx.setStorageSync('_queryString', newQuery)
  }

  clear() {
    wx.removeStorageSync('_queryString')
  }

  isNull() {
    let obj = wx.getStorageSync('_queryString')
    if (JSON.stringify(obj) == '{}' || !obj) {
      return false
    } else {
      console.log('isNull', obj);
      return true
    }
  }
}

// 这是带有岗位字段下拉框的类
class Addpost {
  constructor() {
    setTimeout(() => {
      this.clear()
    }, 24 * 60 * 60 * 1000);

    if ((!this.get() && JSON.stringify(this.get()) != '{}')) {
      return
    }
    // this.getData()

  }

  set(val) {
    wx.setStorageSync('_^JOB_LIST$', val)
  }

  get() {
    return wx.getStorageSync('_^JOB_LIST$') || []
  }

  // 重新请求接口获取数据
  refresh() {
    this.getData()
  }

  clear(){
    wx.removeStorageSync('_^JOB_LIST$')
  }

  isStorage(){
    let obj = wx.getStorageSync('_^JOB_LIST$')
    if (JSON.stringify(obj) == '{}' || !obj) {
      return false
    }else{
      return true
    }
  }

  sethysxDefault(arr){
    if (arr.length > 0) {
      // 一级遍历
      arr.forEach(arr2 => {
        // 二级遍历
        arr2 = arr2.child.unshift({
          catid: 0,
          catname: '不限',
          child: []
        })
      })
    }
    console.log(arr, 'arr');

    return arr
  }

  async getData() {
    try {
      const res = await formSelectDataReq()
      console.log(res.data, 'res.data');
      if (res.data.code === 1) {
        let obj = res.data.data
        obj.gzxz = config.gzxz
        obj.hyzk = config.hyzk
        obj.gender = config.gender
        obj.ishigh = config.ishigh
        obj.situation = config.situation

        // 处理岗位类别添加一个默认值
        obj.catid = this.sethysxDefault(obj.catid)

        this.set(obj)
        return Promise.resolve(obj)
      }
    } catch (error) {
      wx.setStorageSync('_^JOB_LIST$', [])
      return Promise.resolve({})
    }
  }
}

function searchNameWithid(arr, id, key){
  let catname = ''
  if (key == 'catname') {    
    if (arr && arr.length > 0) {
      // console.log(arr, 'arr');
      let item = arr.find(item => item.catid == id)
      if (item) {
        catname = item.catname
      }else{
        arr.forEach(arr2 => {
          let searchresult = searchNameWithid(arr2.child, id, key)
          if (searchresult) {
            console.log(searchresult, 'searchresult', arr2);
            catname = `${arr2.catname},${searchresult}`
            return
          }
        });
      }
    }

  }else if(key == 'name'){
    if (arr && arr.length > 0) {
      let item = arr.find(e => e.id == id)
      catname = item.name
    }
  }

  return catname
  
}
/**
 * 节流函数
 */
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments[0]; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}




let dataUtil = Object.assign({
  formatTime,
  Query,
  Addpost,
  searchNameWithid,
  debounce
}, 
  uploadutils
)
// console.log(dataUtil, 'dataUtil');

module.exports = dataUtil