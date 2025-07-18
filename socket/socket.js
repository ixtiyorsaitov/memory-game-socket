const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(5000, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let users = [];
let rooms = [];

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
      // ✅ Har ikkala foydalanuvchini statusini "playing" ga o'zgartiramiz
      users = users.map((user) => {
        if (user.socketId === socket.id || user.socketId === senderId) {
          return { ...user, status: "playing" };
        }
        return user;
      });
      const roomId = uuidv4();
      // ✅ O'yinni boshlash uchun xabar yuboramiz
      const receiver = getUser(socket.id);
      const sender = getUser(senderId);

      const newRoom = {
        id: roomId,
        players: [receiver, sender],
        admin: senderId,
      };
      rooms.push(newRoom);

      io.to(senderId).emit("game:start", {
        message: "Game started",
        roomId,
        players: [receiver, sender],
      });
      io.to(socket.id).emit("game:start", {
        message: "Game started",
        roomId,
        players: [receiver, sender],
      });

      // ✅ Foydalanuvchilar ro'yxatini ham yangilab yuboramiz (frontend uchun)
      io.emit("user:get-all", users);
    } else {
      io.to(senderId).emit("invite:get-response", {
        response,
        receiver: getUser(socket.id),
      });
    }
  });

  socket.on("game:room", () => {
    const roomOfUser = rooms.find(
      (room) =>
        room.players[0].socketId === socket.id ||
        room.players[1].socketId === socket.id
    );
    if (roomOfUser) {
      socket.emit("game:get-room", roomOfUser);
    } else {
      socket.emit("game:get-room", {
        id: null,
        players: [],
        admin: null,
      });
    }
  });

  socket.on("game:leave", () => {
    const roomOfUser = rooms.find(
      (room) =>
        room.players[0].socketId === socket.id ||
        room.players[1].socketId === socket.id
    );

    if (roomOfUser) {
      io.to(
        roomOfUser.players[roomOfUser.players[0].socketId === socket.id ? 1 : 0]
          .socketId
      ).emit("game:get-room", {
        id: null,
        players: [],
        admin: null,
      });

      rooms = rooms.filter((r) => r.id !== roomOfUser.id);
      io.emit("user:get-all", users);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    const roomOfDiscUser = rooms.find(
      (room) =>
        room.players[0].socketId === socket.id ||
        room.players[1].socketId === socket.id
    );
    if (roomOfDiscUser) {
      rooms = rooms.filter((r) => r.id !== roomOfDiscUser.id);
      io.to(
        roomOfDiscUser.players[
          roomOfDiscUser.players[0].socketId === socket.id ? 1 : 0
        ].socketId
      ).emit("game:get-room", {
        id: null,
        players: [],
        admin: null,
      });
    }
    io.emit("user:get-all", users);
  });
});
