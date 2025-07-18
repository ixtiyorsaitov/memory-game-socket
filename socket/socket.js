const { v4: uuidv4 } = require("uuid");
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
  socket.emit("user:get-socket-id", socket.id);
  socket.on("user:add-online", (data) => {
    addOnlineUser(data, socket.id);
    io.emit("user:get-all", users);
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

  socket.on("invite:response", ({ response, senderId }) => {
    const senderSocket = io.sockets.sockets.get(senderId); // sender socketini top
    const receiver = getUser(socket.id); // qabul qilgan user
    if (response) {
      const roomId = uuidv4();
      socket.join(roomId);
      // ✅ Har ikki foydalanuvchini xonaga qo‘sh
      socket.join(roomId); // qabul qilgan
      if (senderSocket) senderSocket.join(roomId); // yuborgan

      // ✅ Har ikkisiga ham xabar yubor: game boshlansin
      io.to(roomId).emit("game:start", {
        message: "Game started",
        roomId,
        players: [receiver, getUser(senderId)],
      });
    } else {
      io.to(senderId).emit("invite:get-response", {
        response,
        receiver: getUser(socket.id),
      });
    }
  });

  // socket.on('multiplayer:join-room')

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("user:get-all", users);
  });
});
