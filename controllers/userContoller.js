const asyncHandler = require('express-async-handler');
const User = require('../models/user');

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

exports.users = (req, res, next) => {
    res.json({message:'hi i am the index'})
}
exports.users_details = asyncHandler(async (req,res, next) => {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        if(user !== null){
            return res.json(user);
        }else{
            return res.status(404).json({error:'user not found'})
        }
    }catch(e){
        return next(e);
    }
})
exports.users_edit = asyncHandler(async (req,res,next) => {
    const id = req.params.id; 
    try{
        const authData = req.authData;
        const username = authData.username; 

        const userToEdit = await User.findById(id);
        if(userToEdit.username === username){
            // we can edit this person
            const new_bio = req.body.bio;
            await User.updateOne({_id: id}, {bio: new_bio});
            res.json({message:'you can change me'});
        }else{
            // not authorized
            res.status(403).json({error:'you are not authorized to touch this person '});
        }
    }catch(error){
        return next(error)
    }
})

exports.users_delete = asyncHandler(async (req, res, next) => {
    const id = req.params.id; 
    try{
        const authData = req.authData; 
        const userToDelete = await User.findById(id);
        if(userToDelete.username == authData.username){
            // we can delete
            await User.deleteOne({_id: id});
            res.json({message: `${id} successfully deleted`});
        }else{
            res.status(403).json({error: 'Bruh u cannot delete this jon'})
        }
    }catch(error){
        return next(error);
    }
})

exports.users_add_friend = asyncHandler(async (req,res,next) => {
    const id = req.params.id; 
    try{
        const authData = req.authData; 
        console.log('auth data', authData)
        const userToEdit = await User.findById(id);
        if(userToEdit.username === authData.username){
            // can add friend
            const friendId = req.params.friendId;
            console.log('friend id', friendId)
            // check if this guy is even in the friend list 
            const users_friends = userToEdit.friends;
            if(users_friends.includes(friendId)){
                res.status(401).json({error: 'already a friend'});
            }
            // finally add the friend
            await User.updateOne({_id: id}, {$push: {friends: friendId}})
            res.status(201).json({message:`${friendId} added as a friend`})
        }else{
            res.status(403).json({error:'bruh u cant give them friends'});
        }
    }catch(error){
        return next(error)
    }
})

exports.users_remove_friend = asyncHandler(async (req,res,next) => {
    const id = req.params.id; 
    try{
        const authData = req.authData; 
        const userToEdit = await User.findById(id);
        if(userToEdit.username === authData.username){
            // can add friend
            const friendId = req.params.friendId;
            // check if this guy is not in the friend list 
            const users_friends = userToEdit.friends;
            if(!users_friends.includes(friendId)){
                res.status(401).json({error: 'not even a friend'});
            }
            // finally remove the friend
            await User.updateOne({_id: id}, {$pull: {friends: friendId}})
            res.status(201).json({message:`${friendId} removed from a friend`})
        }else{
            res.status(403).json({error:'bruh u cant give them friends'});
        }
    }catch(error){
        return next(error)
    }
})

// get friends list populated with objects GET
exports.users_get_friends = asyncHandler(async (req,res,next) => {
    
})

// get posts list populated with the objects 