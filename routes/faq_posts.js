const express = require('express');
const router = express.Router();
const FAQ_Post = require('../models/FAQ_Post');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;

    try {
        const newFAQPost = new FAQ_Post({
            title,
            content
        });

        await newFAQPost.save();
        res.json(newFAQPost);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 

    try {
        const totalPosts = await FAQ_Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);
        const posts = await FAQ_Post.find()
            .sort({ _id: -1 })  // 최신 글이 맨 위로 오도록 내림차순 정렬
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ posts, totalPages });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
