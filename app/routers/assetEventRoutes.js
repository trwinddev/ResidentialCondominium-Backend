const express = require('express');
const assetEventController = require('../controllers/assetEventController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Route để tìm kiếm sự kiện thiết bị theo mô tả
router.get('/search', verifyToken.checkLogin, assetEventController.searchAssetEvents);

// Route để ghi lịch sử mua thiết bị
router.post('/purchase', verifyToken.checkLogin, assetEventController.purchaseAsset);

// Route để ghi lịch sử bán thiết bị
router.post('/sell', verifyToken.checkLogin, assetEventController.sellAsset);

// Route để ghi lịch sử di chuyển thiết bị
router.post('/move', verifyToken.checkLogin, assetEventController.moveAsset);

// Route để lấy tất cả sự kiện thiết bị
router.get('/', verifyToken.checkLogin, assetEventController.getAllAssetEvents);

// Route để lấy sự kiện thiết bị theo ID
router.get('/:id', verifyToken.checkLogin, assetEventController.getAssetEventById);

// Route để xóa sự kiện thiết bị theo ID
router.delete('/:id', verifyToken.checkLogin, assetEventController.deleteAssetEvent);


module.exports = router;
