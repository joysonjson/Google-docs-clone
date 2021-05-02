const io = require("socket.io")(3002, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    const data = "initial data";
    socket.join(documentId);
    socket.emit("load-documen", data);

    socket.on("send-changes", (delta) => {
      console.log("Changes in the document ", delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
});
