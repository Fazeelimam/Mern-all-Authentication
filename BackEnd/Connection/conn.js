import mongoose from "mongoose";

const ConnectDB= async()=>{
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/Auththentication');
        console.log("MongoDB Connected")
    } catch (error) {
        console.error("Connection Error in MongoDB",error.message);
        throw error;   
    }
}

export default ConnectDB;