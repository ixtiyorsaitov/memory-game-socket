const io = require("socket.io")(5000, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = [];

const addOnlineUser = (user, socketId) => {
  const checkUser = users.find((u) => u.socketId === socketId);
  if (!checkUser) {
    users.push({ ...user, socketId });
  }
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("user:add-online", (data) => {
    addOnlineUser(data, socket.id);
    io.emit("user:get-all", users);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("user:get-all", users);
  });
});
