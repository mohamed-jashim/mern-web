import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import cors from 'cors'
import "./config/passport.js"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
const frontendOrigin = process.env.NODE_ENV === 'production' 
    ? 'http://3.26.153.200:7000'  // hosted frontend
    : 'http://localhost:5173';     // local dev frontend

app.use(cors({
    origin: frontendOrigin,
    credentials: true
}));


app.use(cors({
    origin: frontendOrigin,
    credentials: true
}));

app.use('/auth', authRoute)
app.use('/user', userRoute)

// http://localhost:8000/user/register


app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is listening at port ${PORT}`);  
})