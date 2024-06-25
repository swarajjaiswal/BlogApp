const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkAuth } = require('./middlewares/auth');
const Blog = require('./models/blog')

const app = express();

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

mongoose.connect('mongodb://localhost:27017/BlogApp');

app.use(cookieParser());
app.use(checkAuth('token'));
app.use('/uploads', express.static(path.resolve('./uploads')));


app.get("/", async (req, res) => {
    const AllBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: AllBlogs
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
