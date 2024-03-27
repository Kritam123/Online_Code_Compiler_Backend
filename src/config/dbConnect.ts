import mongoose from "mongoose"

export const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL!,{dbName:"OnlineCode"});
        console.log("DB Connected !")
    } catch (error) {
        console.log(error)
    }
}