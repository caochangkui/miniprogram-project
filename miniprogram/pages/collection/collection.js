// miniprogram/pages/collection/collection.js
const app = getApp()

Page({

  data: {
    list: [],
    isOver: false,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  loadList (id) {
    let { list } = this.data
    let that = this

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'shici_collection',
        page: 1,
        num: 1,
        condition: {
          _id: id
        }
      },
    }).then(res => {
        if(!res.result.data.length) {
          that.setData({
            loading: false,
            isOver: true
          })
        } else {
          let res_data = res.result.data[0]
          list = res_data.collectList
          that.setData({
            list,
            loading: false,
            isOver: list.length ? false : true
          })
        }
      })
      .catch(console.error)
  },

  goDetail (e) {
    let _id = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'collection_update',
      data: {
        id: _id
      },
    }).then(res => {
        console.log('更新成功',res.result)
      })
      .catch(console.error)

    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
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

    let _id = 'collect' + app.globalData.openid

    this.loadList(_id)
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

})