const express = require('express');
const { protect } = require('../middlewares/auth.middleware.js');
const { createTeam, getTeam, addTeamMember, getTeamMembers, updateTeam, deleteTeam, getMyTeams, removeTeamMember, updateTeamMember, getTeamMemberById } = require('../controllers/team.controller.js');
const router = express.Router();
const upload = require('../middlewares/multer.js');

router.route('/').post(protect, upload.single("avatar"), createTeam)
  .get(protect, getMyTeams);
router.route('/:id')
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);


router.route('/:id/members')
  .get(protect, getTeamMembers)
  .post(protect, addTeamMember);

router.route('/:id/members/:memberId')
  .get(protect, getTeamMemberById)
  .delete(protect, removeTeamMember)
  .put(protect, updateTeamMember);

module.exports = router;