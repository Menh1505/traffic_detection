"use strict";

const { countConnect } = require("../helpers/check.connect");
const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(connectString);
class Database {
  constructor() {
    this._connect();
  }

  //connect to the database
  _connect() {
    //Print all queries actions
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Database connection successful", countConnect());
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }

  // Sigleton pattern
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
