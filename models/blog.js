const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImg: {
        type: String,
        required: false,
    },

}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;