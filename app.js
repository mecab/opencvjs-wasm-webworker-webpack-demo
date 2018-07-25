const path = require('path');

const co = require('co');

const koa = require('koa');
const mount = require('koa-mount');
const staticServe = require('koa-static');
const router = require('koa-router')();
const swig = require('koa-swig');

const util = require('./util');

const app = new koa();

if (util.isProduction()) {
    console.log('🏭  App runs in PRODUCTION.');
}
else {
    console.log('👷  App runs in DEVELOPMENT.');
};

const port = process.env.PORT || 3000;
app.context.port = port;

app.context.render = co.wrap(swig({
    root: path.join(__dirname, 'views'),
    autoescape: true,
    cache: util.isProduction() ? 'memory' : false,
    ext: 'html',
    writeBody: false
}));

router.get('/', async(ctx, next) => {
    ctx.body = await ctx.render('index.html');
});

app
    .use(mount('/assets', staticServe(path.join(__dirname, 'builtAssets'))))
    .use(mount('/static', staticServe(path.join(__dirname, 'static'))))
    .use(router.routes());

app.listen(port, () => {
    console.log(`Koa run on port ${port}`);
});
