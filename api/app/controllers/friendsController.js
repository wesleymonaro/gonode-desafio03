const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) return res.status(400).json({ error: 'Users does not exist' });

      if (user.friends.indexOf(res.userId) !== -1) return res.status(400).json({ error: `${user.username} already is your friend` });

      user.friends.push(req.userId);

      await user.save();

      const me = await User.findById(req.userId);
      me.friends.push(user.id);

      await me.save();

      return res.json(me);
    } catch (error) {
      return next(error);
    }
  },
  async destroy(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) return res.status(400).json({ error: 'Users does not exist' });

      const friends = user.friends.indexOf(req.userId);

      if (friends === -1) return res.status(400).json({ error: `${user.username} not is your friend` });

      user.friends.splice(friends, 1);

      await user.save();

      const me = await User.findById(req.userId);
      me.friends.splice(me.friends.indexOf(user.id), 1);

      await me.save();

      return res.json(me);
    } catch (error) {
      return next(error);
    }
  },
};
