/**
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-11-16 17:46:29
 * @version $Id$
 */

const User = require('../models/user.model');
const request = require('../utils/request');
const { appId, appSecret } = require('../../config/vars');

// const getSnsUserinfo = (req, res, next) => {
//   req.originalUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
//   req.params = {
//     appid: appId,
//     secret: appSecret,
//     grant_type: 'authorization_code',
//     code: req.query.code
//   }
// }

exports.getAccessToken = async (req, res, next) => {
  console.log('req.query', req.query)
  req.originalUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
  req.params = {
    appid: appId,
    secret: appSecret,
    grant_type: 'authorization_code',
    code: req.query.code
  }
  request({ req }).then(response => {
    console.log('response', response)
    // next(response)
    if (response.node_data.errcode) {
      res.json(response)
    } else {
      res.middleResponse = response.node_data
      next()
    }
  }).catch(error => {
    console.log('error', error)
    res.json(error);
  });
}

exports.getUser = async (req, res, next) => {
  console.log('next', next)
  req.originalUrl = 'https://api.weixin.qq.com/sns/userinfo'
  req.params = {
    access_token: res.middleResponse && res.middleResponse.access_token,
    openid: res.middleResponse && res.middleResponse.openid,
    lang: 'zh_CN'
  }
  request({ req }).then(async response => {
    if (!response.node_data.errcode) {
      // 根据openid查找用户，如果有结果则所说明该用户已注册，此时需要允许自动登录，还需要额外返回jwt access_token
      // 如果没结果，有两种情况
      // 第一种用户没注册，按正常流程走，注册的时候前端需要传递手机号和openid（非必须，这样可以允许在网页注册）,并且需要调用
      // 第二种用户注册了，但之前注册的时候没传openid（微信授权是后来增加的或者是在非微信客户端注册的），此时需要允许登录，登录的时候如果传递了openid就添加到用户信息，这样以后就可以按第一种情况走了
      const users = await User.list({
        openid: response.node_data.openid
      });
      if (users.length) {
        const transformedUser = users[0].transform();
        console.log('transformedUser', transformedUser);
        const { user, accessToken } = await User.findAndGenerateToken({
          phone: transformedUser.phone,
          captcha: 'wxlg'
        });
        const token = generateTokenResponse(user, accessToken);
        response.node_data.access_token = token;
        response.node_data.registered_user = transformedUser;
      }
    }
    res.json(response);
  }).catch(error => {
    next(error)
  });
}