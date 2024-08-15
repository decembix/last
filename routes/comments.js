const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// 댓글 작성
// 댓글 작성 라우터
router.post('/', auth, async (req, res) => {
    const { content, postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = new Comment({
            content,
            author: req.user.id,
            post: postId
        });

        await newComment.save();
        res.json({ msg: '댓글이 작성되었습니다!', comment: newComment });
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
});

// 특정 게시물에 달린 댓글 가져오기
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', ['username'])
            .sort({ date: -1 });

        res.json(comments);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
