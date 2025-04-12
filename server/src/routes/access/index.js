"use strict";

const express = require("express");
const router = express.Router();

// get traffic status
router.get("/traffic", (req, res) => {
  const trafficStatus = {
    status: "OK",
    message: "Traffic is normal",
  };
  res.json(trafficStatus);
});

module.exports = router;
