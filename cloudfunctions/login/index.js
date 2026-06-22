const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;

  try {
    let user = await db.collection('users').where({ openid: OPENID }).get();
    
    if (user.data.length === 0) {
      await db.collection('users').add({
        data: {
          openid: OPENID,
          nickName: event.nickName || '用户',
          avatarUrl: event.avatarUrl || '',
          createdAt: db.serverDate(),
          lastLoginAt: db.serverDate(),
          accompanyDays: 1
        }
      });
    } else {
      await db.collection('users').where({ openid: OPENID }).update({
        data: {
          lastLoginAt: db.serverDate(),
          ...(event.nickName && { nickName: event.nickName }),
          ...(event.avatarUrl && { avatarUrl: event.avatarUrl })
        }
      });
      
      user = await db.collection('users').where({ openid: OPENID }).get();
    }

    return {
      success: true,
      data: user.data[0],
      openid: OPENID
    };
  } catch (err) {
    console.error('登录失败:', err);
    return {
      success: false,
      errMsg: err.message
    };
  }
};