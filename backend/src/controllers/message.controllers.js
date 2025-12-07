import User from "../models/user.models.js"; // imported bcz of taking input from req.body
import Message from "../models/message.models.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
//we write first export --//-- with async await function
//this logic is used for just fetching users expect main user who logged in
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//logic for chat history with id
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;//we are getting id of person whith we are chatting this id(name(:id)) we given in message.router.js for endpoint.
    const myId = req.user._id;

    //for getting messages we need message.models.js imported in this file
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],// this or block of code will find the all messages which are sent and recived by me
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//logic for sending message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;//by sender(me)
    const { id: receiverId } = req.params;//of reciever [req.params mtlb url mese info extract] 
    const senderId = req.user._id;

    //if we are sending image on cloudnary and it will generate secure url and store it in imageUrl
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    //Creating newMessage in database
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //saving it in database
    await newMessage.save();

    //realtime implimentation for commuication with help of socketio(We are doing later) 
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
