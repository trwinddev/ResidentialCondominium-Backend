const assetController = require('../controllers/assetController');

const router = require('express').Router();
const verifyToken = require('../utils/middleware');

router.get('/', verifyToken.checkLogin, assetController.getAssetExpired);


module.exports = router;
