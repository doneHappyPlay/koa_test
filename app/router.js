'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({app});

  router.group({ name: 'user', prefix: '/user'}, router => {
    router.get('/', controller.user.index);
    router.get('/sendcode', controller.user.email);
    router.get('/captcha', controller.user.captcha);
    router.post('/register', controller.user.add);
    router.post('/login', controller.user.login);
    router.get('/detail', jwt,controller.user.detail);
    

    router.get('/isfollow/:id',jwt, controller.user.isFollow)
    
    router.put('/follow/:id', jwt, controller.user.follow);
    router.delete('/follow/:id', jwt, controller.user.unfollow);

    router.get('/:id/following', controller.user.following);
    router.get('/:id/followers', controller.user.followers);

    router.get('/article/:id', jwt, controller.user.articleStatus);

    // router.put('/likeArticle/:id', jwt, controller.user.likeArticle, controller.user.cancelDislikeArticle);
    router.put('/likeArticle/:id', jwt, controller.user.likeArticle);
    router.delete('/likeArticle/:id', jwt, controller.user.cancelLikeArticle);


    // router.put('/dislikeArticle/:id', jwt, controller.user.dislikeArticle,controller.user.cancelLikeArticle);
    router.put('/dislikeArticle/:id', jwt, controller.user.dislikeArticle);
    router.delete('/dislikeArticle/:id', jwt, controller.user.cancelDislikeArticle);


  });

  router.group({ name: 'article', prefix: '/article'}, router => {
    router.post('/create', jwt,controller.article.create);
    router.get('/:id',controller.article.detail)
    router.get('/',controller.article.index)
  });


  router.get('/', controller.home.index);

};
