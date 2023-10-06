const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const commentSchema = new Schema({
    parent_post_id: {
        type: String, 
        required: [true, 'need a parent post id']
    },
    author:{
        type: String, 
        required: [true, 'need an author username']
    },
    content:{
        type: String, 
        required: [true, 'need content']
    },
    likes: {
        type: Array,
    }
})

module.exports = new mongoose.model('Comment', commentSchema);