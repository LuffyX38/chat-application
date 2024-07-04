const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const renderPage = require("./routes/pages");
const cookieParser = require("cookie-parser");
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static("./views"));
app.use(express.json());
app.set("view engine", "hbs");

app.use("/", renderPage);

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.userid).emit("message-receive", data);
  });

  socket.on("join-room", room => {
    socket.join(room);
    console.log("user is connected to room ", room);
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} is disconnected`);
  });
});

server.listen("3000", "127.0.0.1", () => {
  console.log("server is running on port 3000");
});
