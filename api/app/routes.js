const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

const controllers = requireDir('./controllers');

// Auth
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);


// WITH AUTH
routes.use(authMiddleware);

// USERS
routes.get('/users/me', controllers.userController.me);
routes.put('/users', controllers.userController.update);
routes.get('/feed', controllers.userController.feed);

// FRIENDS
routes.post('/addFriend/:id', controllers.friendsController.create);
routes.delete('/removeFriend/:id', controllers.friendsController.destroy);

// Posts
routes.post('/posts', controllers.postController.create);
routes.delete('/posts/:id', controllers.postController.destroy);
routes.post('/posts/:id/like', controllers.likeController.togglePost);

// COMMENTS
routes.post('/posts/:id/comment', controllers.commentsController.create);
routes.delete('/posts/:postId/comment/:commentId', controllers.commentsController.destroy);
routes.post('/posts/:postId/comment/:commentId/like', controllers.likeController.toggleComment);

module.exports = routes;
