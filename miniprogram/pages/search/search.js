// miniprogram/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchType: '',
    inputValue: '',
    list: [],
    page: 1,
    num: 10,
    loading: false,
    isOver: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    wx.setNavigationBarTitle({
      title: '搜索' + options.type
    })
    this.setData({
      searchType: options.type
    })
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
      isOver: false,
      list: []
    })
  },

  getList() {
    let {inputValue, searchType} = this.data
    if (!inputValue) {
      return
    }

    let database = ''
    let condition = {}

    switch(searchType)
      {
        case '成语':
          database = 'idiom2'
          condition = {word: {
              $regex:'.*'+ inputValue,
              $options: 'i'
            }}
          break;
        case '姓氏':
          database = 'baijiaxing'
          condition = {name: {
            $regex:'.*'+ inputValue,
            $options: 'i'
          }}
          break;
        case '古诗词':
          database = 'gushici'
          condition = {
            name: {
              $regex:'.*'+ inputValue,
              $options: 'i'
            }
          }
          break;
        case '作者':
          database = 'gushici'
          condition = {
            poet: {
              $regex:'.*'+ inputValue,
              $options: 'i'
            }
          }
          break;
        default:
          database = 'xiehouyu'
          condition = {riddle: {
            $regex:'.*'+ inputValue,
            $options: 'i'
          }}
          break;
      }


    if (!this.data.isOver) {
      let { list, page, num } = this.data
      let that = this
      this.setData({
        loading: true
      })

      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database,
          page,
          num,
          condition
        },
      }).then(res => {
        if (!res.result.data.length) {
          that.setData({
            loading: false,
            isOver: true
          })
        } else {
          let res_data = res.result.data
          list.push(...res_data)
          that.setData({
            list,
            loading: false
          })
        }
      })
        .catch(console.error)
    }
  },

  goDetail (e) {
    let _id = e.currentTarget.dataset.id
    let {searchType} = this.data
    let database = ''

    switch(searchType)
    {
      case '成语':
        database = 'idiom-detail'
        break;
      case '姓氏':
        database = 'baijiaxing-detail'
        break;
      case '古诗词':
        database = 'detail'
        break;
      case '作者':
        database = 'detail'
        break;
      default:
        return false;
    }
    wx.navigateTo({
      url: `/pages/${database}/${database}?id=${_id}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})