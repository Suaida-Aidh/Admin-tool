import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDB from './config/db.js';
import userService from './userService.js';
import User from './model/User.js';

dotenv.config({ path: '../.env' });
connectDB();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());


app.use('/api', userService);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'User Service' });
});


const createDefaultAdmin = async () => {
  const adminExists = await User.findOne({ username: 'admin' });

  if (!adminExists) {
    await User.create({
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    });

    console.log(' Default admin created (username: admin, password: admin123)');
  }
};

createDefaultAdmin();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` User Service running on http://localhost:${PORT}`);
});
