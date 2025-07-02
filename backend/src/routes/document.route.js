const express = require('express');
const { getAllDocument, createDocument, updateDocument, removeDocument, getDocumentById, getAllDocsIrrespectiveOfTeam } = require('../controllers/document.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');
const router = express.Router();

router.route('/teams/documents').get(protect, getAllDocsIrrespectiveOfTeam)

router.route('/teams/:teamId/documents')
  .get(protect, getAllDocument)
  .post(protect, createDocument)

router.route('/teams/:teamId/documents/:documentId')
  .get(protect, getDocumentById)
  .put(protect, updateDocument)
  .delete(protect, removeDocument);

module.exports = router;