import express from "express";
import authRoutes from "./routes/auth.routes.js"//we need to write extension due to this is local file
import messageRoutes from "./routes/message.routes.js"
import dotenv from "dotenv";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"; 
import { io, app, server } from "./lib/socket.js";

dotenv.config();
const PORT=process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' })); //to take input from user in form of json format (increased limit for image uploads)
app.use(express.urlencoded({ limit: '10mb', extended: true })); //to handle URL-encoded data
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/Charcha/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "Charcha", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
