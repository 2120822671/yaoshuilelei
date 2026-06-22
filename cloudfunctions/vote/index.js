const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;
  const { action, data } = event;

  try {
    switch (action) {
      case 'create':
        return await createVote(data, OPENID);
      case 'list':
        return await getVoteList(OPENID);
      case 'detail':
        return await getVoteDetail(data.voteId, OPENID);
      case 'vote':
        return await submitVote(data.voteId, data.optionIndex, OPENID);
      case 'delete':
        return await deleteVote(data.voteId, OPENID);
      default:
        return { success: false, errMsg: '未知操作' };
    }
  } catch (err) {
    console.error('投票操作失败:', err);
    return { success: false, errMsg: err.message };
  }
};

async function createVote(data, openid) {
  const { title, options, deadline } = data;
  
  if (!title || !options || options.length < 2) {
    return { success: false, errMsg: '参数错误' };
  }

  const result = await db.collection('votes').add({
    data: {
      title,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      deadline: deadline ? new Date(deadline) : null,
      createdAt: db.serverDate(),
      createdBy: openid,
      voters: [],
      status: 'active'
    }
  });

  return { success: true, data: result };
}

async function getVoteList(openid) {
  const now = new Date();
  const result = await db.collection('votes')
    .orderBy('createdAt', 'desc')
    .get();

  const votes = result.data.map(vote => ({
    ...vote,
    hasVoted: vote.voters && vote.voters.includes(openid),
    totalVotes: vote.options ? vote.options.reduce((sum, opt) => sum + opt.votes, 0) : 0,
    isExpired: vote.deadline ? new Date(vote.deadline) < now : false
  }));

  return { success: true, data: votes };
}

async function getVoteDetail(voteId, openid) {
  const result = await db.collection('votes').doc(voteId).get();
  const vote = result.data;

  return {
    success: true,
    data: {
      ...vote,
      hasVoted: vote.voters.includes(openid),
      totalVotes: vote.options.reduce((sum, opt) => sum + opt.votes, 0)
    }
  };
}

async function submitVote(voteId, optionIndex, openid) {
  const result = await db.collection('votes').doc(voteId).get();
  const vote = result.data;

  if (vote.voters.includes(openid)) {
    return { success: false, errMsg: '您已经投过票了' };
  }

  if (vote.deadline && new Date(vote.deadline) < new Date()) {
    return { success: false, errMsg: '投票已结束' };
  }

  const options = [...vote.options];
  options[optionIndex] = {
    ...options[optionIndex],
    votes: options[optionIndex].votes + 1
  };

  await db.collection('votes').doc(voteId).update({
    data: {
      options,
      voters: [...vote.voters, openid]
    }
  });

  return {
    success: true,
    data: {
      ...vote,
      options,
      voters: [...vote.voters, openid],
      hasVoted: true,
      totalVotes: options.reduce((sum, opt) => sum + opt.votes, 0)
    }
  };
}

async function deleteVote(voteId, openid) {
  const result = await db.collection('votes').doc(voteId).get();
  const vote = result.data;

  if (vote.createdBy !== openid) {
    return { success: false, errMsg: '没有权限删除' };
  }

  await db.collection('votes').doc(voteId).remove();
  return { success: true };
}