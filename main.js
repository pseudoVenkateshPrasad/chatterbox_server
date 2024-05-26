import express from 'express';
import morgan from 'morgan';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;


// import files
import "./config/connectDB.js";
import userRoute from "./src/routes/user.route.js";

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", userRoute);

io.on('connection', (socket) => {
    console.log('a user connected');
});
io.emit('connection', (socket) => {
    console.log('a user emitting');
});

server.listen(port, () => {
    console.log('server running at ' + port);
});