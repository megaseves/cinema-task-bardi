const express = require("express");
const router = express.Router();

const postsController = require("../controller/posts.controller")

router.get("/seats", postsController.getAll)

module.exports = router;