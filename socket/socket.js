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
    const receiver = getUser(socket.id);
    const sender = getUser(senderId);
    if (response) {
      // Change status to playing users
      users = users.map((user) => {
        if (
          user.socketId === sender.socketId ||
          user.socketId === receiver.socketId
        ) {
          return { ...user, status: "playing" };
        }
        return user;
      });
      const gameId = uuidv4();
      const newRoom = {
        players: [receiver, sender],
        id: gameId,
        admin: sender.socketId,
      };
      rooms.push(newRoom);
      console.log(rooms);

      io.to(receiver.socketId).to(sender.socketId).emit("invite:get-response", {
        response,
        receiver,
        gameId,
        room: newRoom,
      });

      // ✅ Foydalanuvchilar ro'yxatini ham yangilab yuboramiz (frontend uchun)
      io.emit("user:get-all", users);
    } else {
      io.to(senderId).emit("invite:get-response", {
        response,
        receiver,
      });
    }
  });

  socket.on("game:room", () => {
    const roomOfPlayer = rooms.find(
      (r) =>
        r.players[0].socketId === socket.id ||
        r.players[1].socketId === socket.id
    );
    console.log("room player", rooms);

    // Emit room of player to client
    io.to(socket.id).emit(
      "game:get-room",
      roomOfPlayer
        ? roomOfPlayer
        : {
            id: null,
            players: [],
            admin: null,
          }
    );
  });

  socket.on("game:chat", (text) => {
    const roomOfPlayer = rooms.find(
      (r) =>
        r.players[0].socketId === socket.id ||
        r.players[1].socketId === socket.id
    );
    if (roomOfPlayer) {
      io.emit("game:get-chat", { text, senderId: socket.id });
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
      users = users.map((u) => {
        if (
          u.socketId === roomOfDiscUser.players[0].socketId ||
          u.socketId === roomOfDiscUser.players[1].socketId
        ) {
          return { ...u, status: "online" };
        }
        return u;
      });
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
      console.log(rooms);
    }
    io.emit("user:get-all", users);
  });
});
