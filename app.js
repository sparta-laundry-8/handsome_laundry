const express = require("express");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const app = express();
const router = express.Router();
app.use(express.json());

app.listen(3000, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
  });