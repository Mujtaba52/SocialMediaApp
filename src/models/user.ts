import { model, Schema,Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

enum role{
    MODERATOR='Moderator',
    MEMBER='Member',
    PREMIUM='Premium'
}

interface IUser {
    _id?:Types.ObjectId;
    name: string;
    email: string;
    password: string;
    following?:Types.ObjectId[];
    followers?:Types.ObjectId[];
    userRole:string;
    tokens?:string;
    generateWebToken?:any;
  }

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required :true
    },
    email:{
        type:String,
        required :true,
        trim: true,
        lowercase:true
    },
    password:{
        type:String,
        trim: true,
        required:true
    },
    following:[{
        type:Types.ObjectId,
        default:[]
    }],
    followers:[{
        type:Types.ObjectId,
        default:[]
    }],
    userRole:{
        type:String,
        enum:role,
        default:role.MEMBER
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

userSchema.methods.generateWebToken = async function(){
    const token = jwt.sign({_id:(this._id).toString()},'mySecretKey');
    this.tokens.unshift({token});
    this.save();
    return token
}

userSchema.pre("save", async function (next) {
    const user = this;
  
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})
userSchema.virtual('post',{
    ref:'post',
    localField: '_id',
    foreignField: 'postedBy'
})

userSchema.virtual('post',{
    ref:'post',
    localField: '_id',
    foreignField: 'sharedBy'
})



userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = model('user',userSchema)


export {User,IUser,role}