const app = getApp();

Page({
  data: {
    nightMode: false
  },

  onLoad() {
    this.setData({
      nightMode: app.getNightMode()
    });
  },

  toggleNightMode(e) {
    const value = e.detail.value;
    app.setNightMode(value);
    this.setData({ nightMode: value });
    wx.showToast({ 
      title: value ? '夜间模式已开启' : '夜间模式已关闭', 
      icon: 'none' 
    });
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '缓存已清除', icon: 'success' });
          this.setData({ nightMode: false });
        }
      }
    });
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私安全。本小程序仅在本地存储您的使用数据，不会上传到服务器。您的数据完全由您自己控制。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  showTerms() {
    wx.showModal({
      title: '用户协议',
      content: '使用本小程序即表示您同意我们的用户协议。请遵守相关规定，文明使用本服务。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});