/**
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-11-23 10:50:11
 * @version $Id$
 */

const express = require('express');

const router = express.Router();

router.use('/', express.static('views'));

module.exports = router;