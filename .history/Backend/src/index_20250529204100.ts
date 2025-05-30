import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
// import cors from 'cors';//added by Moloy
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";
import dotenv from 'dotenv';
import dbConnect from '@/db/connect';

dotenv.config();
dbConnect();

const app = express();

// CORS configuration
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

//pass it33AmHvH7L1uc3z
//username: moloyswe20

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk);
//     next();
//   });
// });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/auth", authRouter);
app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({});
});

app.use(errorHandler);

const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`The application is running on port http://localhost:${port}`);
});
