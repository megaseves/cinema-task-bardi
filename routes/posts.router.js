const express = require("express");
const router = express.Router();

const postsController = require("../controller/posts.controller")

router.get("/seats", postsController.getAll)
router.put("/reserve", postsController.reserveSeat)

module.exports = router;