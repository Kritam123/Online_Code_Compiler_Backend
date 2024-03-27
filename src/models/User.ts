import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim: true,
    },
    picture: {
        type: String,
        default:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
      },
    savedCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Code" }],
},{timestamps:true});


export default mongoose.model("User",userSchema);