const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(400).json({ error: 'Post doens\'t exists' });

      const comment = await Comment.create({
        ...req.body,
        post: req.params.id,
        user: req.userId,
      });

      post.comments.push(comment);

      post.save();

      return res.json(post);
    } catch (error) {
      return next(error);
    }
  },
  async destroy(req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post.comments.filter(
        comment => comment.id === req.params.commentId && comment.user === req.userId,
      )) {
        return res.status(400).json({ error: 'Comment doens\'t exists' });
      }

      const comment = Comment.findById(req.params.commentId);

      post.comments.splice(comment.id, 1);

      post.save();

      return res.send(post);
    } catch (error) {
      return next(error);
    }
  },

};
