var express = require('express');
var router = express.Router();
const userController = require('../controllers/userContoller')

/* GET users listing. */
router.get('/', userController.users);
router.get('/:id', userController.users_details);
router.put('/:id', userController.users_edit);
router.delete('/:id', userController.users_delete);
router.post('/:id/friends/:friendId', userController.users_add_friend);
router.delete('/:id/friends/:friendId', userController.users_remove_friend);

module.exports = router;