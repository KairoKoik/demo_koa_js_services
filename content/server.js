const Koa = require('koa');
const logger = require('koa-morgan')
const Router = require('koa-router')
const request = require('request-promise');
const bodyParser = require('koa-body')()

const models = require('./models')
const siteAPI = "http://localhost:3001"
const server = new Koa();
const router = new Router()

server.use(logger('tiny'));
server.use(router.routes());


router.get('/all_content', async ctx => {
  const content = await models.content.findAll()
  ctx.body = {
    content
  }
});

router.get('/content/:id/', async ctx => {
  const content = await models.content.findOne({where: { id: ctx.params.id }})
  ctx.body = {
    content
  }
})

router.put('/content/:id', bodyParser, async ctx => {
  let sites = await models.content.findOne({where: { id: ctx.params.id }})
  content = await sites.update(ctx.request.body.content)
  ctx.body = {
    content
  }
})

router.post('/content/:id', bodyParser, async ctx => {
  const content = await models.content.create(ctx.request.body.content)
  ctx.body = "sisu on siin";
   await request.put({
       headers: {'content-type': 'application/json'},
       url: `${siteAPI}/site/${ctx.params.id}`,
       body: `{
               "site":{
                     "contentUpdatedAt": `+Date.now()+`
                     }
            }`
   }, (err, siteResponse, body) => {
      if (!err && siteResponse.statusCode === 200) {
           ctx.body = { content };
      } else {
         console.log(siteResponse);
            if (err)
               ctx.status = siteResponse.statusCod || 500;
               ctx.body = `Site Service responded with issue ${err}.`;
            if (siteResponse.statusCode != 200)
               ctx.status = siteResponse.statusCod || 500;
               ctx.body = siteResponse.body;
      }
   });

})

router.del('/content/:id', bodyParser, async ctx => {
  let content = await models.content.findOne({where: { id: ctx.params.id }})
  content = await content.destroy()
  ctx.body = {
    content
  }
})




server.listen(3002);