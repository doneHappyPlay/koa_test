<template>
  <div>
 
<div class="write-btn">
  <el-button @click="submit" type="primary">发布</el-button>
</div>

<el-row :gutter="20">
  <el-col :span="12">
    <textarea class="md-editor" :value="content" @input="update"></textarea>

  </el-col>
  <el-col :span="12">
    
<div class="markdown-body" v-html="compiledMarkdown">

</div>
  </el-col>
</el-row>


  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import marked from 'marked'
export default {
  head:{
    link:[
      {rel:'stylesheet',href:'https://cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.css',}
    ]
  },
  layout:'app',
  data(){
    return {
      content: `
# Node.js基础

### 课程目标

- 了解nodejs特点和应用场景
- 掌握node模块系统使用
- 掌握核心api使用
  - global
  - process
  - path
  - buffer
  - event
  - fs
  - http
- 实战一个简版Express服务器
      `
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.content, { sanitize: true })
    }
  },
  methods:{
    update: debounce(function (e) {
      this.content = e.target.value
    }, 150),
    async submit(){
      let ret = await this.$http.post('/article/create',{content:this.content})
      if(ret.code===0){
        this.$notify({
              title: '创建成功',
              type: 'success',
              message:`文章《${ret.data.title}》创建成功`
        });
        setTimeout(()=>{
          this.$router.push({path:'/article/'+ret.data.id})
        },1000)
      }
      console.log(ret)
      // if(ret.code==)
    }
  }
}
</script>

<style lang="scss">
.md-editor{
  width:100%;
  height:100vh;
  outline: none;
}
.markdown-body{
  height:100vh;
  overflow-y:scroll;
}
.write-btn{
  position:fixed;
  z-index:100;
  right:10px;
  top:10px;
}

</style>