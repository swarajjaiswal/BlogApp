const express = require('express')
const Blog = require('../models/blog')
const multer = require('multer')
const Comment=require('../models/comment')
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./uploads`)
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get('/create', (req, res) => {
    res.render('blogs', {
        user: req.user,
    })
})
router.post('/', upload.single('coverImg'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        coverImg: req.file.path,
    })
    return res.redirect(`/blog/${blog.id}`);
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    const comments = await Comment.find({ blogId: req.params.id })
    res.render('blog', {
        blog,
        comments,
        user: req.user,
    })
})

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user.id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports = router;