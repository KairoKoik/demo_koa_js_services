const Koa = require('koa');
const logger = require('koa-morgan')
const Router = require('koa-router')
const bodyParser = require('koa-body')()

const models = require('./models')

const server = new Koa();
const router = new Router()



server.use(logger('tiny'));
server.use(router.routes());
server.use(router.allowedMethods());

server.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

router.get('/sites', async ctx => {
  const sites = await models.Site.findAll()
  ctx.body = {
    sites
  }
});

router.get('/site/:id', async ctx => {
  const site = await models.Site.findOne({where: { id: ctx.params.id }})
  ctx.body = {
    site
  }
})

router.put('/site/:id', bodyParser, async ctx => {
  let sites = await models.Site.findOne({where: { id: ctx.params.id }})
  site = await sites.update(ctx.request.body.site)
  ctx.body = {
    site
  }
})

router.post('/site', bodyParser, async ctx => {
  const site = await models.Site.create(ctx.request.body.site)
  ctx.body = {
    site
  }
})

router.del('/site/:id', bodyParser, async ctx => {
  let site = await models.Site.findOne({where: { id: ctx.params.id }})
  site = await site.destroy()
  ctx.body = {
    site
  }
})


server.listen(3001);
module.exports = server;