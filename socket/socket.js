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
    io.emit("user:get-all", users);
    io.emit("user:get-socket-id", socket.id);
  });

  socket.on("invite:send", ({ to }) => {
    const from = getUser(socket.id);
    const recipient = getUser(to);

    // Himoya: foydalanuvchi o‘ziga yubormasin, mavjud bo‘lmagan userga yubormasin
    if (!from || !recipient || from.socketId === to) return;

    if (recipient.allowInvites) {
      io.to(to).emit("invite:receive", { from });
    }
  });

  socket.on("user:edit-alow-invites", (data) => {
    users = users.map((u) =>
      u.socketId === socket.id ? { ...u, allowInvites: data } : u
    );
    // io.emit("user:get-allow-invites", socket.id);
    io.emit("user:get-all", users);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("user:get-all", users);
  });
});
