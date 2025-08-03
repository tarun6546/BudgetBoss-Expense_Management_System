const express = require('express');
const { loginController, registerController, updateUserController } = require('../controllers/userController');




const router = express.Router();

//routers
//POST ||LOGIN
router.post('/login', loginController)


//POST ||REGISTER
router.post('/register', registerController)

//POST ||UPDATE USER PROFILE
router.post('/update-user', updateUserController)

module.exports = router;