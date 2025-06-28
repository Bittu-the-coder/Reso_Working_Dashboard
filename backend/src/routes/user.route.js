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
  deleteNotificationById
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { acceptTeamInvitation } = require('../controllers/team.controller');
const upload = require('../middlewares/multer');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/logout').get(protect, logoutUser);
router.route('/update').put(protect, updateUser);
router.route('/updatepassword').put(protect, upload.array('uploads'), updatePassword);

router.route('/getallusers').get(protect, getAllUsers);

// check notifications and update
router.route('/checknotifications').get(protect, checkNotification)
router.route('/acceptinvitation').get(protect, acceptTeamInvitation);
router.route('/checknotification/:id').get(protect, deleteNotificationById);

module.exports = router;