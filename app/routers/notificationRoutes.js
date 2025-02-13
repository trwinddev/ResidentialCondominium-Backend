const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); // Import notificationController
const verifyToken = require('../utils/middleware');


router.get('/', notificationController.getAllNotifications);
router.get("/searchByName", verifyToken.checkLogin, notificationController.searchNotificationByName);


// Endpoint để tạo thông báo
router.post('/', notificationController.createNotification);

// Endpoint để lấy thông báo dựa trên vai trò
router.get('/:role', notificationController.getNotificationsByRole);

// Xóa thông báo
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
