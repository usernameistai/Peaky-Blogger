const express = require('express');
const router = express.Router();
const walks = require('../controllers/walks');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateWalk, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Walk = require('../models/walk');


router.route('/')
    .get(catchAsync(walks.index))
    .post(isLoggedIn, upload.array('image'), validateWalk, catchAsync(walks.createWalk));

router.get('/new', isLoggedIn, walks.renderNewForm);

router.route('/:id')
    .get(catchAsync(walks.showWalk))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateWalk, catchAsync(walks.updateWalk))
    .delete(isLoggedIn, isAuthor, catchAsync(walks.deleteWalk));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(walks.renderEditForm));


module.exports = router;