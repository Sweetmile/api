module.exports = app => {
    const {router, controller} = app;


    router.get('/express/kuaidi100/judge/:postId', controller.express.kuaiDi100.judge);
    router.get('/express/kuaidi100/smartQuery/:postId', controller.express.kuaiDi100.smartQuery);
    router.get('/express/kuaidi100/query/:company/:postId', controller.express.kuaiDi100.query);


    router.get('/', controller.home.index);
};