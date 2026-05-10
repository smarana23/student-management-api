const express = require("express");

const router = express.Router();

const {
  createschool,
  getschools,
} = require("../controllers/schoolController");

router.post("/createschool", createschool);

router.get("/getschools", getschools);

module.exports = router;