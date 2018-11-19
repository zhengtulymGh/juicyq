/**
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-11-16 16:19:21
 * @version $Id$
 */

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/weixin.controller');

const {
  getUser
} = require('../../validations/weixin.validation');

const router = express.Router();

router
  .route('/user')
  .get(validate(getUser), controller.getUser)

module.exports = router;