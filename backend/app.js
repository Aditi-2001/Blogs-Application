import express from 'express'
import mongoose from 'mongoose'
import blogRouter from "./routes/blog-routes";
import router from "./routes/user-routes";
import dotenv from 'dotenv'
import cors from 'cors'


//config dot env file
dotenv.config();

const app = express()


app.use(express.json())
app.use(cors())

app.use("/api/user", router);
app.use("/api/blog", blogRouter);


const PORT = 8080 || process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
.then(() => app.listen(PORT))
.then(() => console.log("Connected to DataBase and running on localhost"))
.catch((err) => console.log(err))

