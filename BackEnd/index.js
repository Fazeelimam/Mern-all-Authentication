import express, { json } from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"
import ConnectDB from "./Connection/conn.js"
import { errorMiddleware } from "./Middleware/middleware.js"
import router from "./Routes/userRouter.js"
import { removeUnverifiedAccount } from "./Auto/removeUnverifiedAccount.js"

// CONNECTION
await ConnectDB();

//MIDDLEWARE
const app = express()
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET,POST,PUT,DELETE"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Routes EndPOINT
app.use('/api/v1',router)


app.get('/',(req,res)=>res.send("API is Working"))

app.use(errorMiddleware);
removeUnverifiedAccount();

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on PORT ${process.env.PORT}`)
})