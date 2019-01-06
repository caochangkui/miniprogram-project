#  微信小程序云开发

## 1. 项目简介

最近研究小程序云，上线了一个有关菜品查询的小程序。包括搜索、分享转发、收藏、查看历史记录等功能。菜谱 API 来自聚合数据。云开发为开发者提供完整的云端支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代，同时这一能力，同开发者已经使用的云服务相互兼容，并不互斥。

目前云开发三大基础能力支持：

- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写自身业务逻辑代码
- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 数据库
- 存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理

## 2. 小程序地址

[https://github.com/caochangkui/miniprogram-food](https://github.com/caochangkui/miniprogram-food)

## 3. 小程序预览：
 
<br>
<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1107952/o_code.jpg" width="240" />
<br> 
 
## 4. 部分截图

#### 首页

<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_%e9%a6%96%e9%a1%b5.GIF" width="225" height="400"  />

#### 收藏


<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_421c638b171ef2820cd981776ac5ca69.GIF" width="225" height="400"  />

#### 历史记录


<img src="https://www.cnblogs.com/images/cnblogs_com/cckui/1069317/o_%e5%8e%86%e5%8f%b2%e8%ae%b0%e5%bd%95.GIF" width="225" height="400"  />

## 5. 项目树

```
.
├── README.md
├── project.config.json                               // 项目配置文件
└── cloudfunctions | 云环境                            // 存放云函数目录
│    └── login                                        // 云函数
│        ├── index.js
│        └── package.json
└── miniprogram
    ├── images                                        // 存放小程序图片
    ├── pages                                         // 存放小程序各种页面
    |    ├── index                                    // 首页
    |    └── menu                                     // 菜单页
    |    └── user                                     // 用户中心
    |    └── search                                   // 搜索页
    |    └── list                                     // 列表页 搜索结果页
    |    └── detail                                   // 详情页
    |    └── databaseGuide                            // 数据库指导页
    |    └── chooseLib                                // 提示页
    |    └── storageConsole                           // 文件上传提示
    ├── style                                         // 样式文件目录
    ├── app.js                                        // 小程序公用逻辑
    ├── app.json                                      // 全局配置
    ├── app.wxss                                      // 全局样式


```

## 6. 历史记录和收藏

[小程序·云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html)提供了三个基础能力：数据库、存储和云函数。


云开发提供了一个 JSON 数据库，数据库中的每条记录都是一个 JSON 格式的对象。一个数据库可以有多个集合（相当于关系型数据中的表），集合可看做一个 JSON 数组，数组中的每个对象就是一条记录，记录的格式是 JSON 对象。

项目中搜索的历史记录和用户收藏的菜品都可以存储到云端数据库。

#### 历史记录的添加和删除：

下面是历史记录的处理方法，菜品收藏与其类似。云开发数据库的增删改查详见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html)。

```
<view class='search'>
    <image src='/images/search.png'></image>
    <input placeholder='今天吃什么' focus bindinput="bindKeyInput" bindconfirm='goSearch' ></input>
    <text bindtap='goSearch'>搜索</text>
</view>
```

```
// pages/search/search.js 
Page({ 
  data: {
    inputValue: '',
    openid: '',
    showHistory: true,
    historyList: []
  },

  // 进入搜索结果页 -> list
  goSearch() {
    let content = this.data.inputValue
    if (!content) { 
      return
    }

    this.onHistory(content)

    wx.navigateTo({
      url: `/pages/list/list?content=${content}`,
    })
  }, 

  // 添加历史记录
  onHistory (content) {
    const db = wx.cloud.database()  // 获取数据库引用
    let that = this

    // 查看是否有历史记录
    db.collection('food').where({
      _openid: this.data.openid,
      _id: 'history' + this.data.openid
    }).get({
      success: res => {
        console.log('数据库查询成功: ', res)
        if (!res.data.length) {
          console.log(' 历史记录为空')
          let historyArray = []
          historyArray.unshift(content)
          db.collection('food').add({
            data: {
              _id: 'history' + that.data.openid,
              description: 'history',
              historyList: historyArray
            }
          }).then(res => {
            console.log(res)
          })
        } else {    
          console.log('已有历史记录')
          let historyArray = res.data[0].historyList
          historyArray.unshift(content)
          console.log([...new Set(historyArray)])
          db.collection('food').doc('history' + that.data.openid).update({
            data: {
              historyList: [...new Set(historyArray)]
            }
          }).then((res) => {
            console.log(res)
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('数据库查询失败：', err)
      }
    })
  },

  // 读取历史记录
  getHistory() {
    let that = this
    const db = wx.cloud.database()
    db.collection('food').doc('history' + that.data.openid).get({
      success(res) {
        console.log(res.data)
        that.setData({
          historyList: res.data.historyList
        })
      }
    })
  },
  
  // 清空历史记录
  bindClearHistory() {
    const db = wx.cloud.database() 
    db.collection('food').doc('history' + this.data.openid).update({
      data: {
        historyList: []
      }
    }).then((res) => {
      console.log(res)
      wx.showToast({
        icon: '删除',
        title: '清空历史',
      })
    })

    this.setData({
      historyList: []
    })
  }
})
```

