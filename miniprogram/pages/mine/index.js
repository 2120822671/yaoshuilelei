const app = getApp();

Page({
  data: {
    greeting: '',
    accompanyDays: 0,
    collections: [],
    collectionCount: 0,
    userInfo: null,
    uploadImages: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  async loadData() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const [collectionsResult, uploadsResult] = await Promise.all([
        app.getUserCollections(),
        app.getUserUploads()
      ]);
      
      const collections = collectionsResult.success ? collectionsResult.data.map(c => c.storyData) : app.getCollections();
      const uploadImages = uploadsResult.success ? uploadsResult.data : wx.getStorageSync('uploadImages') || [];
      
      this.setData({
        greeting: app.getGreeting(),
        accompanyDays: app.getAccompanyDays(),
        collections: collections,
        collectionCount: collections.length,
        userInfo: app.userInfo,
        uploadImages: uploadImages
      });
    } catch (e) {
      console.error(e);
      this.setData({
        greeting: app.getGreeting(),
        accompanyDays: app.getAccompanyDays(),
        collections: app.getCollections(),
        collectionCount: app.getCollections().length,
        userInfo: app.userInfo,
        uploadImages: wx.getStorageSync('uploadImages') || []
      });
    } finally {
      wx.hideLoading();
    }
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: async (profileRes) => {
        try {
          wx.showLoading({ title: '登录中...' });
          
          await app.login(profileRes.userInfo);
          
          this.setData({ 
            userInfo: profileRes.userInfo,
            accompanyDays: app.getAccompanyDays()
          });
          wx.showToast({ title: '登录成功', icon: 'success' });
        } catch (err) {
          console.error('登录失败:', err);
          wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        } finally {
          wx.hideLoading();
        }
      },
      fail: (err) => {
        console.warn('用户取消授权:', err);
        wx.showToast({ title: '请授权登录', icon: 'none' });
      }
    });
  },

  handleAvatarTap() {
    if (!app.userInfo) {
      this.handleLogin();
      return;
    }
    
    wx.showActionSheet({
      itemList: ['更换头像', '查看大图', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.chooseAvatar();
        } else if (res.tapIndex === 1) {
          wx.previewImage({
            urls: [app.userInfo.avatarUrl],
            current: app.userInfo.avatarUrl
          });
        } else if (res.tapIndex === 2) {
          this.handleLogout();
        }
      }
    });
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          this.setData({
            userInfo: null,
            collections: [],
            collectionCount: 0,
            uploadImages: []
          });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadAvatar(res.tempFilePaths[0]);
      },
      fail: () => {
        wx.showToast({ title: '选择图片失败', icon: 'none' });
      }
    });
  },

  async uploadAvatar(filePath) {
    try {
      wx.showLoading({ title: '上传中...' });
      const result = await app.uploadImage(filePath);
      
      await app.addUserUpload({
        fileID: result.fileID,
        cloudPath: result.cloudPath
      });
      
      await app.updateAvatar(result.fileID);
      
      await this.loadData();
      
      wx.showToast({ title: '头像更换成功', icon: 'success' });
    } catch (err) {
      console.error('上传失败:', err);
      wx.showToast({ title: '上传失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  goToStoryDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/story/detail?id=${id}`
    });
  },

  async removeCollection(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    try {
      const result = await app.removeUserCollection(id);
      if (result.success) {
        await this.loadData();
        wx.showToast({ title: '已移除收藏', icon: 'none' });
      } else {
        wx.showToast({ title: result.errMsg || '操作失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  },

  preventBubble() {},

  goToSettings() {
    wx.navigateTo({
      url: '/pages/mine/settings'
    });
  },

  previewImage(e) {
    const fileID = e.currentTarget.dataset.fileid;
    const urls = this.data.uploadImages.map(img => img.fileID);
    wx.previewImage({
      urls: urls,
      current: fileID
    });
  },

  async deleteImage(e) {
    const fileID = e.currentTarget.dataset.fileid;
    const cloudPath = e.currentTarget.dataset.cloudpath;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张照片吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            
            await app.deleteUserUpload(fileID);
            
            await this.loadData();
            
            wx.showToast({ title: '删除成功', icon: 'success' });
          } catch (err) {
            console.error('删除失败:', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadAvatar(res.tempFilePaths[0]);
      },
      fail: () => {
        wx.showToast({ title: '选择图片失败', icon: 'none' });
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: '关于要睡了嘞',
      content: '要睡了嘞是一款睡前陪伴小程序，希望能陪伴你度过每一个宁静的夜晚。愿你每晚都有好梦相伴。',
      showCancel: false,
      confirmText: '知道了'
    });
  }
});