const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

module.exports = {
  async togglePost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) return res.status(400).json({ error: 'Post doens\'t exists' });

      const liked = post.likes.indexOf(req.userId);

      if (liked === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes.splice(liked, 1);
      }

      await post.save();

      return res.json(post);
    } catch (error) {
      return next(error);
    }
  },
  async toggleComment(req, res, next) {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) return res.status(400).json({ error: 'Post doens\'t exists' });

      const commentId = post.comments.find(c => String(c) === req.params.commentId);

      const comment = await Comment.findById(commentId);

      if (!comment) return res.status(400).json({ error: 'Comment doens\'t exists' });

      const liked = comment.likes.indexOf(req.userId);

      if (liked === -1) {
        comment.likes.push(req.userId);
      } else {
        comment.likes.splice(liked, 1);
      }

      await comment.save();

      return res.json(comment);
    } catch (error) {
      return next(error);
    }
  },
};
