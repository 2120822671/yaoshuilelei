const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
// 获取openid
const getOpenId = async () => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
};

// 获取小程序二维码
const getMiniProgramCode = async () => {
  // 获取小程序二维码的buffer
  const resp = await cloud.openapi.wxacode.get({
    path: "pages/index/index",
  });
  const { buffer } = resp;
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: "code.png",
    fileContent: buffer,
  });
  return upload.fileID;
};

// 创建集合
const createCollection = async () => {
  try {
    // 创建集合
    await db.createCollection("sales");
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华东",
        city: "上海",
        sales: 11,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华东",
        city: "南京",
        sales: 11,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华南",
        city: "广州",
        sales: 22,
      },
    });
    await db.collection("sales").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        region: "华南",
        city: "深圳",
        sales: 22,
      },
    });
    return {
      success: true,
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: "create collection success",
    };
  }
};

// 查询数据
const selectRecord = async () => {
  // 返回数据库查询结果
  return await db.collection("sales").get();
};

// 更新数据
const updateRecord = async (event) => {
  try {
    // 遍历修改数据库信息
    for (let i = 0; i < event.data.length; i++) {
      await db
        .collection("sales")
        .where({
          _id: event.data[i]._id,
        })
        .update({
          data: {
            sales: event.data[i].sales,
          },
        });
    }
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 新增数据
const insertRecord = async (event) => {
  try {
    const insertRecord = event.data;
    // 插入数据
    await db.collection("sales").add({
      data: {
        region: insertRecord.region,
        city: insertRecord.city,
        sales: Number(insertRecord.sales),
      },
    });
    return {
      success: true,
      data: event.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

// 删除数据
const deleteRecord = async (event) => {
  try {
    await db
      .collection("sales")
      .where({
        _id: event.data._id,
      })
      .remove();
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
};

const createVote = async (event) => {
  try {
    const { title, options, deadline } = event.data;
    const wxContext = cloud.getWXContext();
    const result = await db.collection("votes").add({
      data: {
        title,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        deadline: deadline ? new Date(deadline) : null,
        createdAt: db.serverDate(),
        createdBy: wxContext.OPENID,
        voters: [],
        status: 'active'
      }
    });
    return {
      success: true,
      data: result
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};

const getVoteList = async () => {
  try {
    const wxContext = cloud.getWXContext();
    const now = new Date();
    const result = await db.collection("votes")
      .orderBy('createdAt', 'desc')
      .get();
    const votes = result.data.map(vote => ({
      ...vote,
      hasVoted: vote.voters && vote.voters.includes(wxContext.OPENID),
      totalVotes: vote.options ? vote.options.reduce((sum, opt) => sum + opt.votes, 0) : 0,
      isExpired: vote.deadline ? new Date(vote.deadline) < now : false
    }));
    return {
      success: true,
      data: votes
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};

const getVoteById = async (event) => {
  try {
    const { voteId } = event.data;
    const wxContext = cloud.getWXContext();
    const result = await db.collection("votes").doc(voteId).get();
    const vote = result.data;
    return {
      success: true,
      data: {
        ...vote,
        hasVoted: vote.voters.includes(wxContext.OPENID),
        totalVotes: vote.options.reduce((sum, opt) => sum + opt.votes, 0)
      }
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};

const vote = async (event) => {
  try {
    const { voteId, optionIndex } = event.data;
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    
    const result = await db.collection("votes").doc(voteId).get();
    const vote = result.data;
    
    if (vote.voters.includes(openid)) {
      return {
        success: false,
        errMsg: '您已经投过票了'
      };
    }
    
    if (vote.deadline && new Date(vote.deadline) < new Date()) {
      return {
        success: false,
        errMsg: '投票已结束'
      };
    }
    
    const options = [...vote.options];
    options[optionIndex] = {
      ...options[optionIndex],
      votes: options[optionIndex].votes + 1
    };
    
    await db.collection("votes").doc(voteId).update({
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
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};

// const getOpenId = require('./getOpenId/index');
// const getMiniProgramCode = require('./getMiniProgramCode/index');
// const createCollection = require('./createCollection/index');
// const selectRecord = require('./selectRecord/index');
// const updateRecord = require('./updateRecord/index');
// const fetchGoodsList = require('./fetchGoodsList/index');
// const genMpQrcode = require('./genMpQrcode/index');
const login = async (event) => {
  try {
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;
    
    const existingUser = await db.collection('users').where({
      openid: openid
    }).get();
    
    if (existingUser.data.length === 0) {
      await db.collection('users').add({
        data: {
          openid: openid,
          createdAt: db.serverDate(),
          lastLoginAt: db.serverDate()
        }
      });
    } else {
      await db.collection('users').where({
        openid: openid
      }).update({
        data: {
          lastLoginAt: db.serverDate()
        }
      });
    }
    
    return {
      success: true,
      openid: openid
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e.message
    };
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "getOpenId":
      return await getOpenId();
    case "getMiniProgramCode":
      return await getMiniProgramCode();
    case "createCollection":
      return await createCollection();
    case "selectRecord":
      return await selectRecord();
    case "updateRecord":
      return await updateRecord(event);
    case "insertRecord":
      return await insertRecord(event);
    case "deleteRecord":
      return await deleteRecord(event);
    case "createVote":
      return await createVote(event);
    case "getVoteList":
      return await getVoteList();
    case "getVoteById":
      return await getVoteById(event);
    case "vote":
      return await vote(event);
    case "login":
      return await login(event);
  }
};
