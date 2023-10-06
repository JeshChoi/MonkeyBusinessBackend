const express = require('express')
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const router = express.Router();

router.get('/', postController.get_posts);
router.post('/', postController.create_post);
router.get('/:postId', postController.get_post_details)
router.put('/:postId', postController.update_post);
router.delete('/:postId', postController.delete_post);

/*
GET - localhost:3000/posts/:id/comments 
POST - localhost:3000/posts/:id
PUT - localhost:3000/posts/:id
DELETE - localhost:3000/posts/:id
*/
router.get('/:postId/comments', commentController.get_post_comments);
router.post('/:postId/comments', commentController.create_post_comment);
router.put('/:postId/comments/:commentId', commentController.update_post_comment);
router.delete('/:postId/comments/:commentId', commentController.delete_post_comment);


module.exports = router;