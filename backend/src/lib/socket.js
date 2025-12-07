import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

//cors is used to allow requests from different origins
//origin is the origin of the request
//we are allowing requests from http://localhost:5173
//we are writing in array because we can have multiple origins
//we are using cors to allow requests from different origins
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];//return the socket id for the user id
}

// used to store online users
const userSocketMap = {}; // {userId: socketId} (map to store the user id and socket id)

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;//get the user id from the socket from frontend
  if (userId) userSocketMap[userId] = socket.id;//store the user id and socket id in the map

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));//send the online users to the frontend

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];//delete the user id and socket id from the map
    io.emit("getOnlineUsers", Object.keys(userSocketMap));//send the online users to the frontend
   });
});

export { io, app, server };