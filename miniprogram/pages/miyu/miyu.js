Page({

  /**
   * 页面的初始数据
   */
  data: {
    alphabeta: ["节日", "动物", "植物", "成语", "字"],
    thisLetter: '',
    list: [],
    page: 1,
    num: 10,
    loading: false,
    isOver: false,
  },

  onLoad: function (options) {
    this.getList('')
  },


  lower(e) {
    if (!this.data.loading) {
      this.getList(this.data.thisLetter)
    }
  },

  getLetterList (e) {
    let letter = e.currentTarget.dataset.letter
    this.setData({
      isOver: false,
      list: [],
      page: 1,
      thisLetter: letter
    })
    this.getList(letter)
  },

  getList(letter) {
    if (!this.data.isOver) {
      let { list, page, num } = this.data
      let that = this
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'miyu',
          page,
          num,
          condition: {type: {
            $regex:'^'+ letter,
            $options: 'i'
          }}
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
            page: page + 1,
            loading: false
          })
        }
      })
        .catch(console.error)
    }
  },

  goDetail (e) {
    let answer = e.currentTarget.dataset.answer
    wx.showModal({
      title: '谜底',
      showCancel: false,
      confirmText: '我知道了',
      content: answer,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  goSearch (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/search/search?type=${type}`,
    })
  },

  goJielong(e) {
    wx.switchTab({
      url: `/pages/find/find`,
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