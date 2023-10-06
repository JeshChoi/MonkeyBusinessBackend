const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {
        type: String, 
        require: [true, 'no author']
    },
    authorUsernmae: {
        type: String, 
        require: [true, 'no username']
    },
    title: {
        type: String, 
        require: [true, 'no title']
    },
    content: {
        type: String, 
        require: [true, 'no content']
    },
    comments: {
        type: Array, 
    },
    likes: {
        type: Array,
    }
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema);