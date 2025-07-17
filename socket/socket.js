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

const getUser = (socketId) => {
  return users.find((user) => user.socketId === socketId);
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("user:add-online", (data) => {
    addOnlineUser(data, socket.id);
    io.emit("user:get-all", { users, userId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("user:get-all", { users });
  });

  socket.on("invite:send", (data) => {
    const sendingUser = getUser(socket.id);
    socket
      .to(data.to)
      .emit("invite:receive", { to: data.to, from: sendingUser });
  });
});
