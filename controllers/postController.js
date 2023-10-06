const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment')
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.get_posts = asyncHandler(async (req,res, next) => {
    try{
        const all_posts = await Post.find();
        res.json(all_posts);
    }catch(error){
        return next(error);
    }
})

// requires auth
exports.create_post = [
body('title', 'empty title').trim().isLength({ min: 1 }).escape(),
body('content', 'empty content').trim().isLength({ min: 1 }).escape(),
asyncHandler(async (req,res,next) => {
    const form_errors = validationResult(req);
    if(form_errors.isEmpty()){
        try{
            const authData = req.authData; 
            console.log(authData);
            const username = authData.username;
            const postTitle = req.body.title; 
            const postContent = req.body.content; 

            const newPost = new Post({
                author: username, 
                title: postTitle, 
                content: postContent,
            })
            await newPost.save();
            const user = await User.findOneAndUpdate({username: username}, {$push: {posts:newPost._id}})
            await user.save();
            return res.status(200).json({created_post: newPost});
        }catch(error){
            return next(error);
        }
        
    }else{
        return res.status(401).json({error: "improper form stuff"});
    }
})]

exports.update_post = [
body('title', 'empty title').trim().isLength({ min: 1 }).escape(),
body('content', 'empty content').trim().isLength({ min: 1 }).escape(),
asyncHandler(async (req,res,next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(403).json({error:'invalid post values'});
    }
    try{
        const authData = req.authData; 
        const username = authData.username; 
        const postId = req.params.postId; 

        const title = req.body.title; 
        const content = req.body.content; 
        
        const the_post = await Post.findById(postId);

        const author = the_post.author; 
        console.log('author: ', author, " requester username: ", username);
        if(author === username){
            
            const postToEdit = await Post.findByIdAndUpdate(postId, {title: title, content: content});
            await postToEdit.save(); 

            return res.status(200).json({message:'post successfully saved', updated_post: postToEdit});
        }else{
            return res.status(403).json({error:'not authorized to edit'})
        }

    }catch(error){
        return next(error)
    }
})  
]
exports.delete_post = asyncHandler(async (req, res, next) => {
    try {
        const delete_post_id = req.params.postId;
        const currentUsername = req.authData.username;
        
        const currentPost = await Post.findById(delete_post_id);

        if (!currentPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (currentPost.author === currentUsername) {
            // Delete all associated comments
            if (currentPost.comments && currentPost.comments.length) {
                await Promise.all(currentPost.comments.map(comment_id => Comment.findByIdAndDelete(comment_id)));
            }

            // Delete the post itself
            const deletedPost = await Post.findByIdAndDelete(delete_post_id);
            
            return res.status(200).json({ message: 'deleted successfully', deleted: deletedPost });
        } else {
            // user is not authorized to do this 
            return res.status(403).json({ error: 'unauthorized to delete this post' });
        }
    } catch (error) {
        return next(error);
    }
});

exports.get_post_details = asyncHandler(async (req,res,next) => {
    const postId = req.params.postId;
    try{
        const the_post = await Post.findById(postId);
        return res.status(200).json({post: the_post});
    }catch(error){
        return next(error)
    }
}) 