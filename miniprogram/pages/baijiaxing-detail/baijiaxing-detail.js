Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    page: 1, // 页码
    num: 1, // 每页展示个数
    isDown: false, // 页面是否请求结束
    loading: false, // 是否正在加载
    isExist: true, // 是否存在
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.loadDetail(options.id) // 加载详情
  },

  loadDetail(id) {
    let { detail, page, num } = this.data
    let that = this
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'baijiaxing',
        page,
        num,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      if (!res.result.data.length) { // 没搜索到
        wx.showToast({
          icon: 'warn',
          title: '加载失败',
        })
        that.setData({
          isExist: false
        })
      } else {
        let detail = res.result.data[0]
        this.setData({
          detail
        })

        wx.hideLoading()
      }
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