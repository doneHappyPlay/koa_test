module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
  __v: { type: Number, select: false },

    email: { type: String , required:true  },
    nickname: { type: String , required:false  },
    avatar: { type: String , required:false,default:'/user.png'  },
    password: { type: String, required:true  ,select: false,},
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    likeArticle:{
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
    },
    dislikeArticle:{
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
    }
  },{ timestamps: true });
  return mongoose.model('User', UserSchema);
}