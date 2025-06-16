const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const PostLike = require("./models/PostLike");
const Post = require("./models/Post");

dotenv.config();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000" , "https://tietsocial.netlify.app"],  // Make sure this is correct for your frontend
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Increase timeout
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));


httpServer.listen(4000, () =>  {
  console.log("Listening on port 4000");
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
  credentials: true,
}));
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
