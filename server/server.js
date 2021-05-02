const fs = require("fs");
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    console.log("sending loading doc before", documentId);

    const document = await findOrCreateDocument(documentId);
    console.log("sending loading doc", document);

    socket.emit("load-document", document);
    socket.join(documentId);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      // findOrCreateDocument(documentId,data)
      updateFile(documentId, data);
    });
  });
});
const updateFile = async (id, fileContent = "") => {
  var filepath = `${id}.txt`;
  let data = JSON.stringify(fileContent, null, 4);
  fs.writeFile(filepath, data, (err) => {
    if (err) throw err;
  });
};
const findOrCreateDocument = async (id, fileContaent = "") => {
  if (id == null) return;
  // or either set fileContent to null to create an empty file

  // The absolute path of the new file with its name
  var filepath = `${id}.txt`;
  let data = JSON.stringify(fileContaent, null, 4);

  if (fs.existsSync(filepath)) {
    // Do something
    console.log(" file exists");

    const readFileAsync = fs.readFileSync(filepath, "utf8");
    console.log("read file async", readFileAsync);

    return JSON.parse(readFileAsync.toString());
  } else {
    fs.writeFile(filepath, data, (err) => {
      if (err) throw err;
      console.log("The file was succesfully saved!");
    });
  }
};
