const express = require('express');
const { addDocs, getDocs, updateDocs, deleteDocs } = require('../controller/docs.controller');

const router = express.Router();

router.route('/').get(getDocs);
router.route('/add-docs').post(addDocs);
router.route('/update-docs/:id').put(updateDocs);
router.route('/delete-docs/:id').delete(deleteDocs);

module.exports = router;