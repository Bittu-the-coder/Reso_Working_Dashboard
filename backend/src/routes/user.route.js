const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateUser,
  updatePassword,
  getAllUsers,
  checkNotification,
  deleteNotificationById,
  getAllNotification,
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/logout').get(protect, logoutUser);
router.route('/update').put(protect, upload.single('avatar'), updateUser);
router.route('/updatepassword').put(protect, updatePassword);

router.route('/getallusers').get(protect, getAllUsers);

// check notifications and update
router.route('/notifications').get(protect, getAllNotification)
router.route('/checknotification/:id')
  .delete(protect, deleteNotificationById)
  .get(protect, checkNotification);

module.exports = router;