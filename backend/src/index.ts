import { Request, Response } from "express";

const express = require("express");
const app = express();
const { client } = require("./config/dbConfig");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Authors
app.use("/authors", require("./routes/authorRoute"));

// Books
app.use("/books", require("./routes/bookRoute"));

app.listen(process.env.port, async () => {
  await client.connect();
  console.log("server running");
});
