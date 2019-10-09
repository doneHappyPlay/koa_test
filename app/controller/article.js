const Controller = require('./base');
const marked = require('marked')

class ArticleController extends Controller {
  async index(){
    const {ctx} = this
    let info = await ctx.model.Article.find().populate('author')
    this.success(info)

  }
  async detail(){
    const {ctx} = this
    console.log('xx',ctx.params)
    let {id} = ctx.params

    let info = await ctx.model.Article.findOneAndUpdate({_id :id},{$inc : {'views' : 1}}).populate('author')
    // let info = await ctx.model.Article.findById(id).populate('author')

    this.success(info)
  }
  async create(){
    const {ctx} = this
    let {userid }= ctx.state
    let {content } = ctx.request.body
    let title = content.split('\n').find(v=>{
      return v.indexOf('# ')==0
    })
    const obj = {
      title:title.replace('# ',''),
      article:content,
      article_html:marked(content),
      author:userid,
    }

    let ret = await ctx.model.Article.create(obj)
    if(ret._id){
      this.success({
        id:ret._id,
        title:ret.title
      })
    }else{
      this.error('创建失败')
    }
  }
  
}

module.exports = ArticleController;
