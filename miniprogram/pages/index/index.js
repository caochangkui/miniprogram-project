//index.js
const app = getApp()

Page({
  data: {
    imgUrls: [
      {
        id: 10222,
        url: '/images/banner5.jpg'
      }, {
        id: 6064,
        url: '/images/banner.jpg'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    indicatorColor: '#fedb00',
    interval: 2000,
    duration: 400,
    activeCategoryId: 1,
    category: [{
        id: "37",
        parentId: "1005",
        img: "/images/wu.png",
        name: '早餐'
      },
      {
        id: "38",
        parentId: "1005",
        img: "/images/zao.png",
        name: '午餐'
      },
      {
        id: "39",
        parentId: "1005",
        img: "/images/xiawu.png",
        name: '下午茶'
      },
      {
        id: "40",
        parentId: "1005",
        img: "/images/wan.png",
        name: '晚餐'
      },
      {
        id: "41",
        parentId: "1005",
        img: "/images/ye.png",
        name: '夜宵'
      }
    ],
    scroll: [{
        id: 1,
        parentId: "10001",
        img: "/images/jiachangcai.jpg",
        name: '家常菜'
      },
      {
        id: 2,
        parentId: "10001",
        img: "/images/kuaishouc.jpg",
        name: '快手菜'
      },
      {
        id: 3,
        parentId: "10001",
        img: "/images/chuangyicai.jpg",
        name: '创意菜'
      },
      {
        id: 4,
        parentId: "10001",
        img: "/images/sucai.jpg",
        name: '素菜'
      },
      {
        id: 5,
        parentId: "10001",
        img: "/images/liangcai.jpg",
        name: '凉菜'
      },
      {
        id: 6,
        parentId: "10001",
        img: "/images/hongbei.jpg",
        name: '烘焙'
      },
      {
        id: 7,
        parentId: "10001",
        img: "/images/mianshi.jpg",
        name: '面食'
      }
    ],
    list: [{
      id: 31,
      parentId: "10004",
      img: "/images/like/yangwei.jpg",
      name: '养胃',
      detail: {
        banner: '',
        title: ''
      }
    }, {
      id: 35,
      parentId: "10004",
      img: "/images/like/bugai.jpg",
      name: '补钙',
      detail: {
        banner: '',
        title: ''
      }
    }, {
      id: 33,
      parentId: "10004",
      img: "/images/like/paidu.jpg",
      name: '排毒',
      detail: {
        banner: '',
        title: ''
      }
    }, {
      id: 28,
      parentId: "10004",
      img: "/images/like/qingfei.jpg",
      name: '清肺',
      detail: {
        banner: '',
        title: ''
      }
    }, {
      id: 29,
      parentId: "10004",
      img: "/images/like/hugan.jpg",
      name: '护肝',
      detail: {
        banner: '',
        title: ''
      }
    }, {
      id: 30,
      parentId: "10004",
      img: "/images/like/jianfei.jpg",
      name: '减肥',
      detail: {
        banner: '',
        title: ''
      }
    }],
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    // 获取用户openId
    this.onGetOpenid()
  },

  goSearch(e) {
    wx.navigateTo({
      url: `/pages/search/search`,
    })
  },

  goDetail(e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },

  goList(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/list/list?content=${e.currentTarget.dataset.content}&tags=${e.currentTarget.dataset.tags}`,
    })
  },

  goMenu(e) {
    wx.switchTab({
      url: `/pages/menu/menu`,
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  onShareAppMessage(res) {
    return {
      title: '开饭嘞',
      path: `pages/index/index`
    }
  },

})