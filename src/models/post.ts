import { time, timeStamp } from "console";
import mongoose, {Schema,model,Types} from "mongoose";


interface IPost {
    _id?:Types.ObjectId;
    description: string;
    likes: [];
    postedBy: Types.ObjectId;
    sharedBy: String;
  }

const postSchema = new Schema({

    description:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    postedBy:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'user'
    },
    sharedBy:[{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'user'        
    }]
},{
    timestamps:true
})


const Post = model('post',postSchema)

export {Post,IPost}