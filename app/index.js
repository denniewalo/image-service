const functions = require("firebase-functions");
const express = require("express");
const Multer = require("multer");
const app = express();
const port = 3000;
const {Storage} = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "webshop-316612",
  keyFilename: "webshop-316612-firebase-adminsdk-p5a75-9e1a67d6a9.json",
});

const bucket = storage.bucket("webshop-316612.appspot.com");

const multer = new Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post("/upload", multer.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.send("404 - File not provided");
  }
  const fileUpload = bucket.file(file.originalname);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobStream.on("error", (error) => {
    res.send("403 - ERROR!");
  });
  blobStream.on("finish", () => {
    res.send("200 - OK!");
  });
  blobStream.end(file.buffer);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

exports.app = functions.https.onRequest(app);
