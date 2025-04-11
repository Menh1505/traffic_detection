"use strict";
require("dotenv").config();

const dev = {
  app: {
    port: process.env.APP_PORT_DEV || 8080,
  },
  db: {
    host: process.env.MONGODB_HOST_DEV || "localhost",
    port: process.env.MONGODB_PORT_DEV || 27017,
    name: process.env.MONGODB_NAME_DEV || "trafficDev",
  },
};

const pro = {
  app: {
    port: process.env.APP_PORT_PRO || 8080,
  },
  db: {
    host: process.env.MONGODB_HOST_PRO || "localhost",
    port: process.env.MONGODB_PORT_PRO || 27017,
    name: process.env.MONGODB_NAME_PRO || "trafficPro",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
