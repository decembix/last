const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// 글작성
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;

    try {
        const newPost = new Post({
            title,
            content,
            author: req.user.id
        });

        await newPost.save();
        res.json(newPost);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//글 가져오기
router.get('/qa/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', ['username']);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // 다음 글: 현재 글보다 최신 글 (날짜가 더 나중인 글)
        const nextPost = await Post.findOne({ date: { $lt: post.date } }).sort({ date: -1 });

        // 이전 글: 현재 글보다 오래된 글 (날짜가 더 이전인 글)
        const previousPost = await Post.findOne({ date: { $gt: post.date } }).sort({ date: 1 });

        res.json({ post, previousPost, nextPost });
    } catch (err) {
        console.error('Error fetching post:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});




router.get('/qa', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const query = req.query.query || '';

    try {
        const totalPosts = await Post.countDocuments({ title: { $regex: query, $options: 'i' } });
        const totalPages = Math.ceil(totalPosts / limit);
        const posts = await Post.find({ title: { $regex: query, $options: 'i' } })
            .populate('author', ['username'])
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ posts, totalPages });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //사용자 일치하는지
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Post.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
