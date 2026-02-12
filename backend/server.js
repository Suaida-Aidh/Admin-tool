import express from 'express';
import cors from 'cors';
import userService from './userService'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors());
app.use(express.json())

app.use('/api', userService);

app.get('/health', (req, res) =>{
    res.json({status: 'OK'})
})

app.listen(3000, () =>{
    console.log("User Service : 3000 runned successfully...!")
})

