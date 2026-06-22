const app = getApp();

Page({
  data: {
    vote: null,
    selectedOption: -1,
    showResult: false
  },

  onLoad(options) {
    if (options.id) {
      this.loadVote(options.id);
    }
  },

  async loadVote(voteId) {
    try {
      wx.showLoading({ title: '加载中...' });
      const result = await app.getVoteDetail(voteId);
      if (result.success) {
        const vote = result.data;
        vote.options = vote.options.map(opt => ({
          ...opt,
          percentage: vote.totalVotes > 0 ? Math.round((opt.votes / vote.totalVotes) * 100) : 0
        }));
        vote.deadlineText = this.formatDate(vote.deadline);
        
        this.setData({ 
          vote: vote,
          showResult: vote.hasVoted
        });
      } else {
        wx.showToast({ title: result.errMsg || '加载失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  selectOption(e) {
    if (this.data.vote.hasVoted) return;
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ selectedOption: index });
  },

  async submitVote() {
    if (this.data.selectedOption === -1) {
      wx.showToast({ title: '请选择一个选项', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '提交中...' });
      const result = await app.submitVote(this.data.vote._id, this.data.selectedOption);

      if (result.success) {
        wx.showToast({ title: '投票成功', icon: 'success' });
        const vote = result.data;
        vote.options = vote.options.map(opt => ({
          ...opt,
          percentage: vote.totalVotes > 0 ? Math.round((opt.votes / vote.totalVotes) * 100) : 0
        }));
        vote.deadlineText = this.formatDate(vote.deadline);
        this.setData({
          vote: vote,
          showResult: true,
          selectedOption: -1
        });
      } else {
        wx.showToast({ title: result.errMsg || '投票失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '投票失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  toggleResult() {
    if (this.data.vote.hasVoted) {
      this.setData({ showResult: !this.data.showResult });
    }
  },

  getPercentage(votes) {
    if (this.data.vote.totalVotes === 0) return 0;
    return Math.round((votes / this.data.vote.totalVotes) * 100);
  },

  formatDate(dateStr) {
    if (!dateStr) return '无截止时间';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  shareVote() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
});