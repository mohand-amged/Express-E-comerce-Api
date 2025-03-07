const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const { authenticate, authorizeAdmin } = require('../Middlewares/authMiddleware');

router.get('/users', authenticate, authorizeAdmin, usersController.getAllUsers);
router.post('/register', usersController.register)
router.post('/login', usersController.login)

module.exports = router;