const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const postsCount = await Post.find({ user: user.id }).count();

      return res.json({
        user,
        postsCount,
        friendsCount: user.friends.lenght,
      });
    } catch (error) {
      return next(error);
    }
  },
  async feed(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const { friends } = user;

      const posts = await Post
        .find({
          user: { $in: [user.id, ...friends] },
        })
        .limit(30)
        .sort('-createdAt');

      return res.json(posts);
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    try {
      const id = req.userId;

      const {
        name, username, password, confirmPassword,
      } = req.body;

      if (password && password !== confirmPassword) return res.status(400).json({ error: 'Password downs\'t match' });

      const user = await User.findByIdAndUpdate(id, { name, username }, { new: true });

      if (password) {
        user.password = password;
        await user.save();
      }

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  },
};
