const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    currentData: 0,
    detail: {},
    page: 1,
    num: 1,
    isDown: false,
    loading: false,
    isExist: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)

    this.setData({
      id: options.id
    })
    if (options.id) {
      this.loadDetail(options.id)
    }
  },

  loadDetail(id) {
    let { detail, page, num } = this.data
    let that = this
    wx.showLoading({
      title: '详情加载中...',
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'feihualing',
        page,
        num,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      console.log(res.result)
      if (!res.result.data.length) {
        that.setData({
          isExist: false
        })
      } else {
        this.setData({
          detail: res.result.data[0]
        })

        console.log(this.data.detail)
      }

      wx.hideLoading()

      that.setData({
        isDown: true
      })
    })
      .catch(err => {
        console.log('失败')
        that.setData({
          isExist: false
        })
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