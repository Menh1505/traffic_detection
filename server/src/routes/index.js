"use strict";

const express = require("express");
const router = express.Router();

//check apiKey
//check permission

router.use("/api/v1", require("./access"));

module.exports = router;
