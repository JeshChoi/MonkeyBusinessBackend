const {body, validationResult} = require('express-validator');
const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment');
const Post = require('../models/post');

exports.get_post_comments = asyncHandler(async (req,res,next) => {
    // get posted_comments
    const post_id = req.params.postId; 
    try{
        const post = await Post.findById(post_id);
        const post_comments_text = await Comment.find({
            '_id': { $in: post.comments }
        });
        return res.status(200).json({post_comments: post_comments_text});
    }catch(error){
        return next(error)
    }
})
exports.create_post_comment = [
    body('content', 'empty content').trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req,res,next) => {
        if(!validationResult(req).isEmpty()) {
            return res.status(401).json({error: 'invalid content'})
        }
        try{
            const content = req.body.content;
            const authData = req.authData;
            const newComment = new Comment({
                parent_post_id: req.params.postId,
                author: authData.username,
                content: content,
            })
            const commentRes = await newComment.save(); 
            const currentPost = await Post.findByIdAndUpdate(req.params.postId, {$push : {comments: commentRes._id}});
            res.status(200).json({comment: commentRes});
        }catch(error){
            return next(error);
        }
    })
]
exports.update_post_comment = [
    body('content', 'empty content').trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req,res,next) => {
        if(!validationResult(req).isEmpty()) {
            return res.status(401).json({error: 'invalid content'})
        }
        try{
            const postId = req.params.postId;
            const commentId = req.params.commentId; 
            const authData = req.authData; 

            const comment = await Comment.findById(commentId);
            if(comment.author === authData.username){
                const content = req.body.content; 
                const editedComment = await Comment.findByIdAndUpdate(commentId, {content: content});
                const editedPost = await Post.findByIdAndUpdate(postId, {$pull : {comments: {_id : commentId}}});
                res.status(200).json({editedComment: editedComment});
            }else{
                res.status(403).json({error:'unauthorized to edit this bud'})
            }     
        }catch(error){
            next(error);
        }
    })
]
exports.delete_post_comment = asyncHandler(async (req,res,next) => {
    // user or author can delete
    const username = req.authData.username; 
    const comment = await Comment.findById(req.params.commentId);
    const post = await Post.findById(req.params.postId);
    if(comment.author === username || username === post.author){
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({deletedComment: deletedComment});
    }else{
        res.status(403).json({error: 'forbidden bruh'})
    }
})