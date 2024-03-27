import mongoose from "mongoose"
interface ICodeSchema {
    fullCode: {
      html: string;
      css: string;
      javascript: string;
    };
    title: string;
    isOwner:boolean
  ownerInfo: mongoose.Types.ObjectId | string;
  ownerName: string;
  }
const codeSchema = new mongoose.Schema<ICodeSchema>({
    fullCode:{
        html:String,
        css:String,
        javascript:String
    },
    title: { type: String, required: true },
    ownerInfo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerName: String,
},{timestamps:true})

export default mongoose.model("Code",codeSchema);