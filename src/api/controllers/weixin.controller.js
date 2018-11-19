/**
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-11-16 17:46:29
 * @version $Id$
 */
const request = require('../utils/request');
const { appId, appSecret } = require('../../config/vars');

exports.getUser = async (req, res, next) => {
  console.log('req.query', req.query)
  req.originalUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
  req.params = {
    appid: appId,
    secret: appSecret,
    grant_type: 'authorization_code',
    code: req.query.code
  }
  request({ req }).then(response => {
    res.json(response)
  }).catch(error => {
    next(error)
  });
}