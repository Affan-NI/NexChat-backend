import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
//kk


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: [
    'http://localhost:5173',
    // 'http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

app.use('/api',chatRoutes);
app.use("/api/auth",authRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.get("/test",async(req,res)=>{
  res.json({
    msg:"test was succeful final and last check final"
  })
})


// app.post('/test',async (req, res) => {
//   const options={
//     method:"POST",
//     headers:{
//       "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
//       'Content-Type':'application/json',
//     },
//     body: JSON.stringify({
//       model: "gemini-2.5-flash",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: req.body.message,
//             }
//           ]
//         }
//       ]
//     })
//   };

//   try {
//     const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', options);
//     const data = await response.json();
//     // console.log(data.candidates[0].content.parts[0].text);
//     res.json(data.candidates[0].content.parts[0].text);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });

//   }
// });










// using gemini by npm 
// import {GoogleGenAI} from '@google/genai';
// import 'dotenv/config';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: 'give in short about sky',
//   });
//   console.log(response.text);
// }

// main();